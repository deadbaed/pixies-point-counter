{
  sources ? import ./npins,
  pkgs ? import sources.nixpkgs { },
  lib ? pkgs.lib,
}:

pkgs.stdenv.mkDerivation (finalAttrs: {
  pname = "pixies-point-counter";
  version = "0.0.0";

  src = lib.cleanSource ./.;

  nativeBuildInputs = with pkgs; [
    nodejs_24
    pnpmConfigHook
    pnpm_10
  ];

  pnpmDeps = pkgs.fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 3;
    hash = "sha256-ygsEzXJM1GL2RSBOm9PvTCMBtBX3ZYzS568gCO+OJqQ=";
  };

  CI = true; # TODO: wait for https://github.com/pnpm/pnpm/pull/10634 to remove this env variable

  buildPhase = ''
    runHook preBuild
    pnpm build --base=/pixies-point-counter
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mv dist $out
    runHook postInstall
  '';
})
