#!/usr/bin/env bash

for i in ./*; do
    mv -- "$i" "${i//-@ui9_bot/}"
done
