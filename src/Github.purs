module Github where

import Prelude

import Data.Either (Either)
import Data.String (joinWith)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?))

import Control.Monad.Eff.Console (CONSOLE)
import Control.Monad.Aff (Aff)

import Network.HTTP.Affjax (get, AJAX)

-- TODO : use Reader monad to create a Github client
baseUrl :: String
baseUrl = "https://api.github.com"

purescriptRepoUrl :: String
purescriptRepoUrl = baseUrl <> "/repos/purescript/purescript"

purescriptReleaseUrl :: String
purescriptReleaseUrl = purescriptRepoUrl <> "/releases"

data GithubRelease = GithubRelease {
                      url :: String
                    , tag_name :: String
                    }

instance githubReleaseShow :: Show GithubRelease where
  show (GithubRelease r) = "url : " <> r.url <> " tag_name : " <> r.tag_name

instance githubReleaseEncode :: DecodeJson GithubRelease where
  decodeJson json = do
    obj <- decodeJson json
    url <- obj .? "url"
    tag_name <- obj .? "tag_name"
    pure $ GithubRelease { url, tag_name }

-- TODO
-- - Handle response status

fetchReleases :: forall eff. Aff (ajax :: AJAX, console :: CONSOLE | eff) (Either String (Array GithubRelease))
fetchReleases = do 
  res <- get purescriptReleaseUrl
  pure $ decodeJson res.response
