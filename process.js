const fs = require('fs');
let logic = fs.readFileSync('e:/vulpinix-remix/logic.txt', 'utf8');
logic = logic.replace('import { motion, AnimatePresence }', 'import { motion, AnimatePresence, useScroll, useSpring }');
const pyCode = fs.readFileSync('e:/vulpinix-remix/script.py', 'utf8');
const jsx = pyCode.split("'''")[1];
fs.writeFileSync('e:/vulpinix-remix/Vulpinix/src/pages/UploadPage.tsx', logic + '\n' + jsx, 'utf8');
console.log("Success");
