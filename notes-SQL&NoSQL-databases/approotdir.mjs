import * as path from 'path';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
//import.meta is the object used to get meta info about files.
//what is url.fileURLToPath? Ans:It converts url into properly encoded path. e.g.
// // Node program to demonstrate the 
// URL.fileURLToPath() API as Setter
  
// Importing the module 'url' 
// const url = require('url');
  
// Some random path from system
// const file = 'file://computerscience/geeksforgeeks.txt'
 
// Converting our file to properly encoded path                    
// console.log(url.fileURLToPath(file)) 
// output will be
// \\computerscience\geeksforgeeks.txt
const __dirname = path.dirname(__filename);
export const approotdir = __dirname;