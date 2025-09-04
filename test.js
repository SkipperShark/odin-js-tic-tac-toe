import { log } from 'node:console';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
function test(a,b,c) {
  throw new Error("error thrown")
}
rl.question("whats your name", (input) => {
  test(1,2)
  console.log(input);
})

// import { createInterface } from 'node:readline/promises';

// const rl = createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// const answer = await rl.question('What is your favorite food? ');
// console.log(`Oh, so your favorite food is ${answer}`);


let test = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]
console.log(test[3][1])