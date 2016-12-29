module Model.Release where

import Prelude

import Control.Monad.Aff
import Network.HTTP.Affjax

import Data.Either
import Data.Array
import Data.Argonaut

data Release = Release
  {
    tag :: String
  }

instance decodeRelease :: DecodeJson Release where
  decodeJson json = do
    obj <- decodeJson json
    tag <- obj .? "tag_name"
    pure $ Release { tag }

fetchReleases :: forall eff. Aff (ajax :: AJAX | eff) (Either String (Array Release))
fetchReleases = do
  res <- get "https://api.github.com/repos/purescript/purescript/releases"
  pure $ decodeJson res.response
