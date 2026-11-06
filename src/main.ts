import * as core from '@actions/core';
import { upload } from './ali-oss-upload';

async function run(): Promise<void> {
  try {
    await upload();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
