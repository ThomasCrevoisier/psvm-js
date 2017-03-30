module Ls where

import Prelude

import Control.Monad.Eff.Class

import Node.FS.Aff
import Node.OS

installedVersions = do
  home <- liftEff homedir
  readdir $ home <> "/.psvm/versions"
