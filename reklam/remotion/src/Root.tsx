import React from "react";
import { Composition } from "remotion";
import { ReelManifestoComposition } from "./compositions/ReelManifesto";
import { CinemaTrailerComposition } from "./compositions/CinemaTrailer";
import { CinemaTrailerMobileComposition } from "./compositions/CinemaTrailerMobile";
import { HtmlGlitchShowcaseComposition } from "./compositions/HtmlGlitchShowcase";
import { HtmlGlitchMobileComposition } from "./compositions/HtmlGlitchMobile";
import { SquareSpotComposition } from "./compositions/SquareSpot";
import { SquareSpotMobileComposition } from "./compositions/SquareSpotMobile";
import { StoryBurstComposition } from "./compositions/StoryBurst";
import { DavetnameReelComposition } from "./compositions/DavetnameReel";
import { IkiIsimReelComposition } from "./compositions/IkiIsimReel";
import { MisafirReelComposition } from "./compositions/MisafirReel";
import { TemaGalerisiReelComposition } from "./compositions/TemaGalerisiReel";
import { HikayemizReelComposition } from "./compositions/HikayemizReel";
import { GeriSayimReelComposition } from "./compositions/GeriSayimReel";
import { AniDefteriReelComposition } from "./compositions/AniDefteriReel";
import { HediyeListesiReelComposition } from "./compositions/HediyeListesiReel";
import { CokDilliReelComposition } from "./compositions/CokDilliReel";
import { KendiAlanAdiniReelComposition } from "./compositions/KendiAlanAdiniReel";
import { KutuReelComposition } from "./compositions/KutuReel";
import { OmurlukReelComposition } from "./compositions/OmurlukReel";

const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      {/* 9:16 — full manifesto reel for IG/TikTok */}
      <Composition
        id="ReelManifesto"
        component={ReelManifestoComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 30}
      />

      {/* 16:9 — cinematic trailer for YouTube/Vimeo/web hero */}
      <Composition
        id="CinemaTrailer"
        component={CinemaTrailerComposition}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={FPS * 30}
      />

      {/* 16:9 — Remotion HTML-in-Canvas showcase */}
      <Composition
        id="HtmlGlitchShowcase"
        component={HtmlGlitchShowcaseComposition}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={FPS * 22}
      />

      {/* 1:1 — square feed spot */}
      <Composition
        id="SquareSpot"
        component={SquareSpotComposition}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={FPS * 18}
      />

      {/* 9:16 — short story burst */}
      <Composition
        id="StoryBurst"
        component={StoryBurstComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 12}
      />

      {/* 9:16 — Cinema Trailer'ın Reels uyarlaması */}
      <Composition
        id="CinemaTrailerMobile"
        component={CinemaTrailerMobileComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 30}
      />

      {/* 9:16 — HTML × Tuval showcase Reels uyarlaması */}
      <Composition
        id="HtmlGlitchMobile"
        component={HtmlGlitchMobileComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 22}
      />

      {/* 9:16 — Kare spotun Reels uyarlaması */}
      <Composition
        id="SquareSpotMobile"
        component={SquareSpotMobileComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 18}
      />

      {/* 9:16 — "Bir mektup gibi açılsın" */}
      <Composition
        id="DavetnameReel"
        component={DavetnameReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 16}
      />

      {/* 9:16 — "İki İsim", Cartier-minimal */}
      <Composition
        id="IkiIsimReel"
        component={IkiIsimReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 12}
      />

      {/* 9:16 — "Misafiriniz Yanıtlasın", canlı katılım akışı */}
      <Composition
        id="MisafirReel"
        component={MisafirReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 18}
      />

      {/* 9:16 — "Sekiz Dünya", tema geçidi */}
      <Composition
        id="TemaGalerisiReel"
        component={TemaGalerisiReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 20}
      />

      <Composition
        id="HikayemizReel"
        component={HikayemizReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 18}
      />

      <Composition
        id="GeriSayimReel"
        component={GeriSayimReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 12}
      />

      <Composition
        id="AniDefteriReel"
        component={AniDefteriReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 14}
      />

      <Composition
        id="HediyeListesiReel"
        component={HediyeListesiReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 15}
      />

      <Composition
        id="CokDilliReel"
        component={CokDilliReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 12}
      />

      <Composition
        id="KendiAlanAdiniReel"
        component={KendiAlanAdiniReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 14}
      />

      <Composition
        id="KutuReel"
        component={KutuReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 10}
      />

      <Composition
        id="OmurlukReel"
        component={OmurlukReelComposition}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 15}
      />
    </>
  );
};
