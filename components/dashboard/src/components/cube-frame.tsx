/**
 * Copyright (c) 2020 TypeFox GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { Bootanimation } from '../bootanimation';
import * as React from 'react';
import { Branding } from '@gitpod/gitpod-protocol';

export interface CubeFrameProps {
    errorMode: boolean;
    errorMessage?: string;
    branding?: Branding;
    showFixedLogo?: boolean;
}

export interface CubeFrameState {
    fixedLogo?: string;
}

export class CubeFrame extends React.Component<CubeFrameProps, CubeFrameState> {
    
    private static readonly DEFAULT_STATIC_LOGO = "/images/gitpod-logo-no-text.svg";

    private canvas: HTMLCanvasElement | null;
    private bootanimation?: Bootanimation;

    constructor(props: CubeFrameProps) {
        super(props);
        this.state = {};
    }

    protected updateFixedLogoState() {
        if (this.props.branding && this.props.branding.startupLogo) {
            this.state = {
                fixedLogo: this.props.branding!.startupLogo
            };
            return;
        }
        if (!!this.props.showFixedLogo || !this.bootanimation) {
            this.state = {
                fixedLogo: CubeFrame.DEFAULT_STATIC_LOGO
            }
            return;
        }
        this.state = { fixedLogo: undefined };
    }

    protected showFixedLogo() {
        return !!this.props.showFixedLogo || (this.props.branding && this.props.branding.startupLogo);
    }

    componentWillUnmount() {
        if (this.bootanimation !== undefined) {
            this.bootanimation.dispose();
            this.bootanimation = undefined;
        }
    }

    componentDidMount() {
        if (this.canvas != null && !this.showFixedLogo()) {
            try {
                this.bootanimation = Bootanimation.create(this.canvas);
                this.bootanimation.start();
            } catch (err) {
                console.warn("WebGL is not supported");
                this.bootanimation = undefined;
            }
            this.updateFixedLogoState();
        }
    }

    render() {
        if (this.bootanimation) {
            this.bootanimation.setInErrorMode(this.props.errorMode);
        }
        this.updateFixedLogoState();

        return (
            <div className='start'>
                <canvas ref={(e) => this.canvas = e} style={{ display: !!this.state.fixedLogo ? 'none' : 'block' }}></canvas>
                { !!this.state.fixedLogo &&
                    <div className="gitpod-boot-logo-div">
                        <img className="gitpod-boot-logo" src={this.state.fixedLogo} />
                    </div>
                }
                <div className="error message">{this.getErrorMessage()}</div>
                {this.props.children}
            </div>
        );
    }

    protected getErrorMessage() {
        if (!this.props.errorMessage) {
            return undefined;
        }

        return (
            <div>
                <div> {this.props.errorMessage}</div>
                <div>Please <a href="https://github.com/gitpod-io/gitpod/issues/new?template=bug_report.md"
                    target="_blank" rel="noopener noreferrer">file an issue</a> if you think this is a bug.</div>
            </div>
        );
    }
}