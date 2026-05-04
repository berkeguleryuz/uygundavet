import { Config } from "@remotion/cli/config";

// We symlink ../../public -> ./public so Remotion's bundler picks up the
// project's existing assets without copying. setPublicDir() with an external
// path doesn't propagate to the webpack bundle during render, but a symlink
// inside the project root does.

Config.setVideoImageFormat("jpeg");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setNumberOfGifLoops(null);

// HtmlInCanvas needs the Angle GL backend on most setups.
Config.setChromiumOpenGlRenderer("angle");

// Beauty over speed.
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
