module Model.InstalledVersion where

import Prelude

import Control.Monad.Aff
import Control.Monad.Eff
import Control.Monad.Eff.Class
import Node.FS.Aff
import Node.FS
import Node.OS

import Data.Array

type InstalledVersion = String

psvmDir :: forall eff. Eff (os :: OS | eff) String
psvmDir = do
  home <- homedir
  pure $ home <> "/.psvm"

getInstalledVersions :: forall eff. Aff (fs :: FS, os :: OS | eff) (Array InstalledVersion)
getInstalledVersions = do
  psvmPath <- liftEff psvmDir
  files <- readdir $ psvmPath <> "/versions"
  pure files
