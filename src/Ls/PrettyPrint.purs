module Ls.PrettyPrint where

import Prelude (($), (<$>), (<>))
import Data.String (joinWith)

prettyPrintInstalledVersions :: Array String -> String
prettyPrintInstalledVersions versions = joinWith "\n" $
                                          ("\t" <> _) <$> versions
