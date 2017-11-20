#!/bin/bash -x

npm run test:unit
test_result=$?

if [ $test_result -eq 0 ]; then
  echo 'Unit tests OK'
  exit 0
else
  echo 'Unit tests FAIL'
  exit 1
fi

