import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync, brotliCompressSync, constants} from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// A fresh folder avoids overwriting earlier release candidates.
const output = path.join(root, 'dist', new Date().toISOString().replace(/[:.]/g, '-'));
const report = [];
async function copy(relative) {
  const bytes = await readFile(path.join(root, relative));
  const target = path.join(output, relative);
  await mkdir(path.dirname(target), {recursive:true});
  await writeFile(target, bytes);
  const entry = {file:relative, bytes:bytes.length};
  if (/\.(html|css|js|svg)$/.test(relative)) {
    const gzip = gzipSync(bytes, {level:9});
    const br = brotliCompressSync(bytes, {params:{[constants.BROTLI_PARAM_QUALITY]:6}});
    await writeFile(target+'.gz', gzip);
    await writeFile(target+'.br', br);
    Object.assign(entry,{gzip:gzip.length,brotli:br.length});
  }
  report.push(entry);
}
async function walk(relative) {
  for(const entry of await readdir(path.join(root,relative),{withFileTypes:true})) {
    const file = path.posix.join(relative,entry.name);
    if(entry.isDirectory()) await walk(file);
    else if (!file.endsWith('/valley-poster.png') && !file.endsWith('/README.md')) await copy(file);
  }
}
await copy('index.html');
await walk('src');
await walk('assets');
await writeFile(path.join(output,'_headers'), `/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
/assets/fonts/*
  Cache-Control: public, max-age=86400
/assets/projects/*
  Cache-Control: public, max-age=86400
`);
await writeFile(path.join(output,'build-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({output,files:report.length,rawBytes:report.reduce((n,r)=>n+r.bytes,0),brotliBytes:report.reduce((n,r)=>n+(r.brotli??r.bytes),0)},null,2));
