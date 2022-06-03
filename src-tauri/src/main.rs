#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use palette::{FromColor, Gradient, Lch, Srgb};

#[tauri::command]
fn generate_gradient(r: u8, g: u8, b: u8) -> Vec<Vec<u8>> {
    let my_col = Srgb::new(r as f32 / 255.0, g as f32 / 255.0, b as f32 / 255.0);
    let my_lch = Lch::from_color(my_col.into_linear());
    let gradient = Gradient::new(vec![
        Lch::new(0.0, my_lch.chroma, my_lch.hue),
        my_lch,
        Lch::new(128.0, my_lch.chroma, my_lch.hue),
    ]);
    let colors = gradient
        .take(16)
        .map(|col| {
            let (r, g, b) = Srgb::from_color(col).into_components();
            vec![(r * 255.0) as u8, (g * 255.0) as u8, (b * 255.0) as u8]
        })
        .collect::<Vec<_>>();

    colors
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_gradient])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
