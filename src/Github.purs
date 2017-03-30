module Github where

import Prelude

import Data.Either
import Data.String
import Data.Argonaut.Decode

import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (log, CONSOLE)
import Control.Monad.Aff (Aff)

import Network.HTTP.Affjax (get, AJAX)

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

prettyPrintRelease :: GithubRelease -> String
prettyPrintRelease (GithubRelease r) = r.tag_name

prettyPrintReleases :: Array GithubRelease -> String
prettyPrintReleases releases = joinWith "\n" $ ("\t" <> _) <$> prettyPrintRelease <$> releases

-- TODO
-- - Handle response status
-- - Parse response

-- fetchReleases ::
fetchReleases :: forall eff. Aff (ajax :: AJAX, console :: CONSOLE | eff) (Either String (Array GithubRelease))
fetchReleases = do 
  res <- get purescriptReleaseUrl
  pure $ decodeJson res.response
