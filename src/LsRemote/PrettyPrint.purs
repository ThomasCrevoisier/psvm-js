module LsRemote.PrettyPrint where

import Prelude

import Data.String

import Github

prettyPrintRelease :: GithubRelease -> String
prettyPrintRelease (GithubRelease r) = r.tag_name

prettyPrintReleases :: Array GithubRelease -> String
prettyPrintReleases releases = joinWith "\n" $ 
                               ("\t" <> _) <$> prettyPrintRelease <$> releases
