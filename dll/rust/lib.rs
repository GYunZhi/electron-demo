// add.rs
// #[no_mangle] 和 extern "C" 用于确保函数可以从外部调用，并且函数名不会被改变。
// rustc --crate-type cdylib lib.rs

#[no_mangle]
pub extern "C" fn add(a: f64, b: f64) -> f64 {
    a + b
}
