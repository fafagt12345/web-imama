<?php

namespace App\Http\Controllers;

use App\Models\SiteContent;
use App\Models\Event;
use App\Models\Staff;
use App\Models\Gallery;
use App\Models\Timeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ApiController extends Controller
{
    public function getData()
    {
        $site = SiteContent::first() ?? new SiteContent();
        
        return response()->json([
            'hero' => [
                'title' => $site->hero_title,
                'subtitle' => $site->hero_subtitle,
            ],
            'about' => [
                'intro' => $site->about_intro,
                'history' => $site->about_history,
                'vision' => $site->about_vision,
            ],
            'settings' => [
                'email' => $site->contact_email,
                'instagram' => $site->contact_instagram,
            ],
            'events' => Event::all(),
            'staff' => Staff::all(),
            'gallery' => Gallery::all(),
            'timeline' => Timeline::all(),
        ]);
    }

    public function saveData(Request $request)
    {
        // Verifikasi Password (sama dengan logic Node.js sebelumnya)
        $adminPass = env('ADMIN_PASS', 'imama123');
        if ($request->input('password') !== $adminPass) {
            return response()->json(['success' => false, 'message' => 'Password salah!'], 401);
        }

        $data = $request->input('data');
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Payload data kosong'], 400);
        }

        try {
            return DB::transaction(function () use ($data) {
                // Simpan Site Content
                SiteContent::updateOrCreate(
                    ['id' => 1],
                    [
                        'hero_title' => $data['hero']['title'] ?? '',
                        'hero_subtitle' => $data['hero']['subtitle'] ?? '',
                        'about_intro' => $data['about']['intro'] ?? '',
                        'about_history' => $data['about']['history'] ?? '',
                        'about_vision' => $data['about']['vision'] ?? '',
                        'contact_email' => $data['settings']['email'] ?? '',
                        'contact_instagram' => $data['settings']['instagram'] ?? '',
                    ]
                );

                // Sync Arrays
                if (isset($data['events'])) {
                    Event::query()->delete();
                    foreach ($data['events'] as $item) Event::create($item);
                }

                if (isset($data['staff'])) {
                    Staff::query()->delete();
                    foreach ($data['staff'] as $item) Staff::create($item);
                }

                if (isset($data['timeline'])) {
                    Timeline::query()->delete();
                    foreach ($data['timeline'] as $item) Timeline::create($item);
                }

                return response()->json(['success' => true, 'message' => 'Data disinkronkan!']);
            });
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}