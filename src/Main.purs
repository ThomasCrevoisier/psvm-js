module Main (module Command.LsRemote, main) where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)

import Command.LsRemote

main :: forall e. Eff (console :: CONSOLE | e) Unit
main = do
  log "Hello you !"
