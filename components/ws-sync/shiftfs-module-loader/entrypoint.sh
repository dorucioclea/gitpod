#!/bin/bash

DRIVER_NAME=shiftfs
DRIVER_VERSION=1.2
ARCH=$(uname -m)
KERNEL_RELEASE=$(uname -r)
KERNEL_VERSION=$(uname -v | sed 's/#\([[:digit:]]\+\).*/\1/')

if lsmod | grep $DRIVER_NAME; then
    echo "shiftfs is already loaded - nothing to do here"
    exit 0
fi

set -ex
dkms install -m ${DRIVER_NAME} -v ${DRIVER_VERSION} -k $KERNEL_RELEASE
insmod /var/lib/dkms/${DRIVER_NAME}/${DRIVER_VERSION}/${KERNEL_RELEASE}/${ARCH}/module/${DRIVER_NAME}.ko
