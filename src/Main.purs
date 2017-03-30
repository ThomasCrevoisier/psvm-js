module Main where

import Prelude

import Data.Either

import Control.Monad.Eff.Class
import Control.Monad.Eff.Console

import Control.Monad.Aff (launchAff)
import Network.HTTP.Affjax (get)

import Github (fetchReleases, prettyPrintReleases)

lsRemote = launchAff $ do
  releases <- fetchReleases
  case releases of
       Left err -> liftEff $ log $ "Error while fetching PureScript releases : " <> err
       Right releases' -> liftEff $ log $ "Releases available for PureScript : \n" <> prettyPrintReleases releases'

ls :: String
ls = "hey"
