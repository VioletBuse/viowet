#!/usr/bin/env zx

import "zx/globals";

$.verbose = true;

// clean up and setup
await $`rm -rf ./bin/*`;
await $`mkdir -p ./bin/archive-linux ./bin/archive-macos ./bin/archive-windows`;

// build standalone executables
await $`npx pkg . --out-path ./bin --sea --public --no-bytecode`;

// copy to the archive directories before tarring
await Promise.all([
  $`cp ./bin/viowet-linux ./bin/archive-linux/viowet`,
  $`cp ./bin/viowet-macos ./bin/archive-macos/viowet`,
  $`cp ./bin/viowet-win.exe ./bin/archive-windows/viowet.exe`,
]);

// compress
await Promise.all([
  await $`tar -czvf ./bin/viowet.linux.tar.gz ./bin/archive-linux/`,
  await $`tar -czvf ./bin/viowet.macos.tar.gz ./bin/archive-macos/`,
  await $`tar -czvf ./bin/viowet.win.tar.gz ./bin/archive-windows/`,
]);

// cleanup
await $`rm -rf ./bin/archive-linux ./bin/archive-macos ./bin/archive-windows`;
