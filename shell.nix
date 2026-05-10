{
  sources ? import ./npins,
  pkgs ? import sources.nixpkgs { },
}:

pkgs.mkShellNoCC {
  packages = with pkgs; [
    npins
    nixd
    nixfmt

    nodejs_24
    pnpm_10
    vtsls
  ];
}
