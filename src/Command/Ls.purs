module Command.Ls where

import Prelude

import Control.Monad.Aff
import Control.Monad.Eff.Class
import Control.Monad.Eff.Console

import Data.String

import Model.InstalledVersion

ls = launchAff $ do
  versions <- getInstalledVersions
  liftEff $ log $ joinWith "\n" versions 
