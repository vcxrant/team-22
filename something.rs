
mod args;
use args::Args;

fn main(){
    let args = Args{
    image_1: String:: new(),
    image_2: String:: new(),
    output:String::new()
    };
    println!("Hello World")
}


/* fn main1() {
    let mut args: Args = args();
    // 0th argument is the main run location
    let first = args.nth(1).unwrap();
    let operator = args.nth(0).unwrap().chars().next().unwrap();
    let second = args.nth(0).unwrap();
    let firstNumber: f32 = first.parse().unwrap();
    let second_number = second.parse::<f32>().unwrap();
    let result = operate(operator, firstNumber, second_number);
    println!("{:?} ", output(firstNumber, operator, second_number, result));
} */

fn operate(operator: char, first_number: f32, second_number: f32) -> f32 {
    /* if operator == '+' {
        return first_number + second_number;
    } else if operator == '-' {
        return first_number - second_number;
    } else if operator == '/' {
        return first_number / second_number;
    } else if operator == 'x' {
        return first_number * second_number;
    } else {
        return 0.0;
    } */

    match operator {
        '+' => first_number + second_number,
        '-' => first_number - second_number,
        '/' => first_number / second_number,
        '*' | 'x' | 'X' => first_number * second_number,
        _ => panic!(" Invalid Operator used"),
    }
}

fn output(first_number: f32, operator: char, second_number: f32, result: f32) -> String {
    format!("{} {} {} = {}", first_number, operator, second_number, result)
}

fn get_nth_arg(n: usize) -> String {
    stf::env::args().nth(n).unwrap()
}
struct Args {
    image_1: String,
    image_2: String,
    output: String,
}