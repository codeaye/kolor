#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "macos")]
use macos::WindowExt as _;

use colors_transform::{Color, Rgb};
use palette::{FromColor, Gradient, Lch, Srgb};
use random_color::RandomColor;
use tauri::Manager;

#[tauri::command]
fn random_colour() -> String {
    RandomColor::new().to_hex()
}

#[tauri::command]
fn palette(hex: &str) -> Vec<String> {
    #[cfg(debug_assertions)]
    println!("Hex: {}!", hex);

    let rgb = Rgb::from_hex_str(hex).unwrap();
    let srgb = Srgb::new(
        rgb.get_red() / 255.0,
        rgb.get_green() / 255.0,
        rgb.get_blue() / 255.0,
    );
    let lch = Lch::from_color(srgb.into_linear());
    let gradient = Gradient::new(vec![
        Lch::new(0.0, lch.chroma, lch.hue),
        lch,
        Lch::new(128.0, lch.chroma, lch.hue),
    ]);
    let colors = gradient
        .take(20)
        .map(|col| {
            let (ar, ag, ab) = Srgb::from_color(col).into_components();
            let as_rgb = Rgb::from_tuple(&(ar * 255., ag * 255., ab * 255.)).to_css_hex_string();
            as_rgb
        })
        .collect::<Vec<_>>();

    #[cfg(debug_assertions)]
    {
        println!("SRGB: {:?}", srgb);
        println!("Gradient: {:?}", colors);
        println!("RGB: {:?}", rgb);
    }

    colors
}

#[tauri::command]
#[cfg(target_os = "macos")]
fn is_macos() -> bool {
    true
}

#[tauri::command]
#[cfg(not(target_os = "macos"))]
fn is_macos() -> bool {
    false
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            window.set_transparent_titlebar(true, false);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![palette, random_colour, is_macos])
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
