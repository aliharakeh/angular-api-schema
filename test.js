const url = new URL('some-url', 'http://www.example.com/');
url.search = new URLSearchParams({a: 1, b: 'b'}).toString();

console.log(url);
console.log(url.search);
console.log(url.toString());
