module Current where

import Prelude

import Control.Monad.Eff.Console

import Node.ChildProcess
import Node.Buffer
import Node.Encoding

printVersion result = do
  output <- toString UTF8 result.stdout
  log $ "Current version of PureScript used : " <> output

printCurrentVersion = do
  exec "psc --version" defaultExecOptions printVersion
