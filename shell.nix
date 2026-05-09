{
  sources ? import ./npins,
  pkgs ? import sources.nixpkgs { },
}:

pkgs.mkShellNoCC {
  packages = with pkgs; [
    npins
    nil
    nixfmt

    nodejs_24
    pnpm
    vtsls
  ];
}
