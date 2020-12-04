export default function userNameGenerator() {
    const a = ["Small", "Blue", "Ugly","Bad"];
    const b = ["Bear", "Dog", "Banana", "Cat"];

    const rA = Math.floor(Math.random() * a.length);
    const rB = Math.floor(Math.random() * b.length);
    const name = a[rA] + b[rB] + Date.now()
    return name
}