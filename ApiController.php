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
        try {
            return DB::transaction(function () use ($request) {
                // Simpan Site Content
                SiteContent::updateOrCreate(
                    ['id' => 1],
                    [
                        'hero_title' => $request->input('hero.title'),
                        'hero_subtitle' => $request->input('hero.subtitle'),
                        'about_intro' => $request->input('about.intro'),
                        'about_history' => $request->input('about.history'),
                        'about_vision' => $request->input('about.vision'),
                        'contact_email' => $request->input('settings.email'),
                        'contact_instagram' => $request->input('settings.instagram'),
                    ]
                );

                // Sync Data Arrays
                if ($request->has('events')) {
                    Event::query()->delete();
                    foreach ($request->events as $item) Event::create($item);
                }

                if ($request->has('staff')) {
                    Staff::query()->delete();
                    foreach ($request->staff as $item) Staff::create($item);
                }

                if ($request->has('gallery')) {
                    Gallery::query()->delete();
                    foreach ($request->gallery as $item) {
                        Gallery::create(['image_url' => $item['image_data'] ?? ($item['image_url'] ?? $item)]);
                    }
                }

                if ($request->has('timeline')) {
                    Timeline::query()->delete();
                    foreach ($request->timeline as $item) Timeline::create($item);
                }

                return response()->json(['success' => true, 'message' => 'Data disinkronkan!']);
            });
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}