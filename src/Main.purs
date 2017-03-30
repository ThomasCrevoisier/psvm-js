module Main where

import Prelude

import Data.Either (Either(..))

import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (log)

import Control.Monad.Aff (launchAff)

import Github (fetchReleases)

import Ls (installedVersions)
import Ls.PrettyPrint (prettyPrintInstalledVersions)
import LsRemote.PrettyPrint (prettyPrintReleases)

import Current

lsRemote = launchAff $ do
  releases <- fetchReleases
  let message = case releases of
                  Left err -> "Error while fetching PureScript releases : " <> err
                  Right releases' -> "Releases available for PureScript : \n" <> prettyPrintReleases releases'
  liftEff $ log message

ls = launchAff $ do
  versions <- installedVersions
  liftEff $ log $ "Installed versions of PureScript :\n" <> prettyPrintInstalledVersions versions

current = printCurrentVersion
