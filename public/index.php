<?php
// Mencegah file diakses secara langsung jika menggunakan CLI server (opsional)
if (php_sapi_name() === 'cli-server') {
    return false;
}

$htmlFile = __DIR__ . '/index.html';
if (!file_exists($htmlFile)) {
    die("index.html tidak ditemukan!");
}

$html = file_get_contents($htmlFile);
$cacheFile = __DIR__ . '/seo_cache.json';
$cacheTime = 300; // Cache 5 menit untuk mempercepat loading (300 detik)

$settings = null;
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTime)) {
    $settings = json_decode(file_get_contents($cacheFile), true);
} else {
    // Ambil data terbaru dari backend
    $ch = curl_init('https://app.haloarsitek.com/api/settings');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3); // Timeout 3 detik agar tidak membuat web hang jika backend mati
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 && $response) {
        $result = json_decode($response, true);
        if (isset($result['success']) && $result['success']) {
            $settings = $result['data'];
            file_put_contents($cacheFile, json_encode($settings));
        }
    }
    
    // Fallback jika API gagal tetapi ada cache lama
    if (!$settings && file_exists($cacheFile)) {
        $settings = json_decode(file_get_contents($cacheFile), true);
    }
}

if ($settings) {
    // Siapkan data dari backend
    $title = isset($settings['site_name']) && $settings['site_name'] ? $settings['site_name'] : 'Halo Arsitek Studio.';
    $desc = $settings['seo_meta_description'] ?? '';
    
    // Logo Absolute URL
    $img = '';
    if (!empty($settings['site_logo'])) {
        $img = 'https://app.haloarsitek.com/' . ltrim($settings['site_logo'], '/');
    }

    // Replace Title
    $html = preg_replace('/<title>.*?<\/title>/s', "<title>{$title}</title>", $html);
    $html = preg_replace('/<meta property="og:title" content=".*?" \/>/s', '<meta property="og:title" content="' . htmlspecialchars($title) . '" />', $html);
    $html = preg_replace('/<meta name="twitter:title" content=".*?" \/>/s', '<meta name="twitter:title" content="' . htmlspecialchars($title) . '" />', $html);
    
    // Replace Description
    if ($desc) {
        $html = preg_replace('/<meta name="description" content=".*?" \/>/s', '<meta name="description" content="' . htmlspecialchars($desc) . '" />', $html);
        $html = preg_replace('/<meta property="og:description" content=".*?" \/>/s', '<meta property="og:description" content="' . htmlspecialchars($desc) . '" />', $html);
        $html = preg_replace('/<meta name="twitter:description" content=".*?" \/>/s', '<meta name="twitter:description" content="' . htmlspecialchars($desc) . '" />', $html);
    }

    // Replace Image
    if ($img) {
        $html = preg_replace('/<meta property="og:image" content=".*?" \/>/s', '<meta property="og:image" content="' . htmlspecialchars($img) . '" />', $html);
        $html = preg_replace('/<meta name="twitter:image" content=".*?" \/>/s', '<meta name="twitter:image" content="' . htmlspecialchars($img) . '" />', $html);
    }
}

// Output HTML yang sudah dimodifikasi
echo $html;
