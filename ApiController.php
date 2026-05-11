<?php

namespace App\Http\Controllers;

use App\Models\SiteContent;
use App\Models\Event;
use App\Models\Staff;
use App\Models\Gallery;
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
        ]);
    }

    public function saveData(Request $request)
    {
        return DB::transaction(function () use ($request) {
            // Simpan Site Content
            $site = SiteContent::firstOrNew([]);
            $site->hero_title = $request->input('hero.title');
            $site->hero_subtitle = $request->input('hero.subtitle');
            $site->about_intro = $request->input('about.intro');
            $site->about_history = $request->input('about.history');
            $site->about_vision = $request->input('about.vision');
            $site->contact_email = $request->input('settings.email');
            $site->contact_instagram = $request->input('settings.instagram');
            $site->save();

            // Untuk data array (Event, Staff, Gallery), kita reset dan isi ulang
            // (Atau bisa dikembangkan menggunakan updateOrCreate)
            if ($request->has('events')) {
                Event::truncate();
                foreach ($request->events as $item) Event::create($item);
            }
            
            // Tambahkan logika serupa untuk staff dan gallery...

            return response()->json(['success' => true, 'message' => 'Data disinkronkan!']);
        });
    }
}