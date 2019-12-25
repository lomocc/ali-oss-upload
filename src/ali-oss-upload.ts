import * as core from '@actions/core';
import Client from 'ali-oss';
import glob from 'glob';
import path from 'path';
import slash from 'slash';

export async function upload(): Promise<void> {
  try {
    // process.env.REGION
    // process.env.ACCESS_KEY_ID
    // process.env.ACCESS_KEY_SECRET
    // process.env.BUCKET
    // ali-oss options
    const region =
      core.getInput('region', { required: false }) || process.env.REGION;
    const accessKeyId =
      core.getInput('accessKeyId', { required: false }) ||
      process.env.ACCESS_KEY_ID;
    const accessKeySecret =
      core.getInput('accessKeySecret', { required: false }) ||
      process.env.ACCESS_KEY_SECRET;
    const bucket =
      core.getInput('bucket', { required: false }) || process.env.BUCKET;
    const aclType = core.getInput('aclType', { required: false });
    // upload options
    const pattern = core.getInput('pattern', { required: true });
    const overwrite =
      core.getInput('overwrite', { required: false }) !== 'false';
    const fromDir = core.getInput('fromDir', { required: false }) || '.';
    const toDir = core.getInput('toDir', { required: false }) || '.';

    const client = new Client({
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
      timeout: 360000
    });

    const files = glob.sync(pattern, { cwd: fromDir });
    for (const file of files) {
      core.info('====================================');
      const objectName = slash(path.join(toDir, file));
      let shouldUpload = true;
      if (!overwrite) {
        try {
          const result = await client.get(objectName);
          if (result.res.status !== 200) {
            shouldUpload = false;
          }
        } catch (error) {
          core.info(`NoSuchKey: ${objectName}`);
        }
      }
      if (shouldUpload) {
        try {
          //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
          const filePath = path.join(fromDir, file);
          core.info(`Upload: ${objectName} to ${filePath} aclType:${aclType}`);
          await client.put(objectName, filePath);
          if (aclType != null) {
            // 管理文件访问权限
            await client.putACL(objectName, aclType);
          }
          core.info(`Complete: ${objectName}`);
          core.info('====================================');
        } catch (e) {
          //
          core.info(`Error: ${e.code}`);
        }
      }
    }
    core.info(`All Complete !`);
  } catch (error) {
    core.setFailed(error.message);
  }
}
