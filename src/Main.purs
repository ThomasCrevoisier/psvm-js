module Main where

import Prelude

import Data.Either (Either(..))

import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (log)

import Control.Monad.Aff (launchAff)

import Github (fetchReleases)
import LsRemote.PrettyPrint (prettyPrintReleases)

lsRemote = launchAff $ do
  releases <- fetchReleases
  let message = case releases of
                  Left err -> "Error while fetching PureScript releases : " <> err
                  Right releases' -> "Releases available for PureScript : \n" <> prettyPrintReleases releases'
  liftEff $ log message

ls :: String
ls = "hey"
