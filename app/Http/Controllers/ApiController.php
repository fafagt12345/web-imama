<?php

namespace App\Http\Controllers;

use App\Models\SiteContent;
use App\Models\Event;
use App\Models\Staff;
use App\Models\Gallery;
use App\Models\Timeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiController extends Controller
{
    public function getData()
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function saveData(Request $request)
    {
        try {
            $adminPass = config('app.admin_pass', env('ADMIN_PASS', 'imama123'));
            if ($request->input('password') !== $adminPass) {
                return response()->json(['success' => false, 'message' => 'Password salah!'], 401);
            }

            // Jika hanya verifikasi login
            if ($request->input('action') === 'login') {
                return response()->json(['success' => true, 'message' => 'Login berhasil']);
            }

            $data = $request->input('data');
            if (!$data) return response()->json(['success' => false, 'message' => 'Data kosong'], 400);

            return DB::transaction(function () use ($data) {
                // 1. Simpan Site Content
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

                // 2. Sync Events
                if (isset($data['events'])) {
                    Event::query()->delete();
                    foreach ($data['events'] as $item) {
                        Event::create([
                            'title' => $item['title'] ?? '',
                            'description' => $item['description'] ?? ($item['desc'] ?? ''),
                            'category' => $item['category'] ?? 'Umum',
                            'date' => $item['date'] ?? ($item['event_date'] ?? null),
                            'image' => $item['image'] ?? ($item['image_data'] ?? null),
                        ]);
                    }
                }

                // 3. Sync Staff
                if (isset($data['staff'])) {
                    Staff::query()->delete();
                    foreach ($data['staff'] as $item) {
                        // Filter hanya data yang ada di fillable untuk keamanan
                        Staff::create(collect($item)->only([
                            'name', 'position', 'image', 'department', 'major', 'batch'
                        ])->toArray());
                    }
                }

                // 4. Sync Gallery
                if (isset($data['gallery'])) {
                    Gallery::query()->delete();
                    foreach ($data['gallery'] as $item) {
                        $url = is_array($item) ? ($item['image_url'] ?? ($item['image_data'] ?? '')) : $item;
                        Gallery::create(['image_url' => $url]);
                    }
                }

                // 5. Sync Timeline
                if (isset($data['timeline'])) {
                    Timeline::query()->delete();
                    foreach ($data['timeline'] as $item) Timeline::create($item);
                }

                return response()->json(['success' => true, 'message' => 'Data berhasil disinkronkan!']);
            });
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }
}