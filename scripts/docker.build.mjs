#!/usr/bin/env zx

import "zx/globals";

$.verbose = true;

const images = {
  "worker-ubuntu-22-04": ["worker-ubuntu-22.04"],
};

for (const [image_stage, tags] of Object.entries(images)) {
  const tags_args = tags
    .map((tagname) => ["--tag", `ghcr.io/violetbuse/viowet:${tagname}`])
    .flat();
  await $`docker build --target ${image_stage} ${tags_args} .`;
}
