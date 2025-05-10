// e2e/scripts/convert-videos-to-gif.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as glob from 'glob';

const execAsync = promisify(exec);


/**
 * .webmファイルをAnimationGIFに変換します
 * @param speed
 * @description 再生速度を指定します。デフォルトは1（等速）です。2:50%の速度（2倍遅い）
 */
async function convertWebmToGif(speed: number = 1) {
  const testResultsDir = path.resolve(__dirname, '../test-results');

  // すべての.webmファイルを検索
  const webmFiles = glob.sync('**/*.webm', {
    cwd: testResultsDir
  });

  for (const webmFile of webmFiles) {
    const webmPath = path.join(testResultsDir, webmFile);
    const gifPath = webmPath.replace('.webm', '.gif');

    console.log(`Converting ${webmPath} to ${gifPath} with speed ${speed}x`);

    try {
      // setptsで再生速度を調整（例：0.5倍速なら setpts=2*PTS）
      await execAsync(
        `ffmpeg -y -i "${webmPath}" -vf "setpts=${speed}*PTS,fps=6,scale=600:-1:flags=lanczos" -c:v gif "${gifPath}"`
      );
      console.log(`Successfully converted to ${gifPath}`);
    } catch (error) {
      console.error(`Error converting ${webmPath}:`, error);
    }
  }
}

// 引数から速度を取得（デフォルト1）
const speed = process.argv[2] ? parseFloat(process.argv[2]) : 1;
console.log(`Converting videos with speed ${speed}x`);

// 速度を引数として渡す
convertWebmToGif(speed).catch(console.error);
