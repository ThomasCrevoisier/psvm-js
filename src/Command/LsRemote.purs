module Command.LsRemote where

import Prelude

import Control.Monad.Aff
import Control.Monad.Eff.Class
import Control.Monad.Eff.Console
import Network.HTTP.Affjax

import Data.Array
import Data.Either
import Data.String

import Model.Release

lsRemote = launchAff $ do
  releases <- fetchReleases
  case releases of
    Left err -> liftEff $ log $ "An error occured " <> err
    Right releases' -> liftEff $ do
      log "Available versions of PureScript : "
      log $ joinWith "\n" $ showRelease <$> releases'

  where
    showRelease :: Release -> String
    showRelease (Release r) = r.tag
