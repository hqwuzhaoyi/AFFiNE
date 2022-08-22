import { Protocol } from '@toeverything/datasource/db-service';
import {
    AsyncBlock,
    BaseView,
    CreateView,
} from '@toeverything/framework/virgo';
import {
    Block2HtmlProps,
    commonBlock2HtmlContent,
} from '../../utils/commonBlockClip';

import { TextView } from './TextView';

export class QuoteBlock extends BaseView {
    type = Protocol.Block.Type.quote;

    View: (prop: CreateView) => JSX.Element = TextView;

    // override ChildrenView = IndentWrapper;

    override async onCreate(block: AsyncBlock): Promise<AsyncBlock> {
        if (!block.getProperty('text')) {
            await block.setProperty('text', {
                value: [{ text: '' }],
            });
        }
        return block;
    }

    override html2block(
        el: Element,
        parseEl: (el: Element) => any[]
    ): any[] | null {
        const tag_name = el.tagName;
        if (tag_name === 'BLOCKQUOTE') {
            const childNodes = el.childNodes;
            const texts = [];
            for (let i = 0; i < childNodes.length; i++) {
                const blocks_info = parseEl(childNodes[i] as Element);
                for (let j = 0; j < blocks_info.length; j++) {
                    if (blocks_info[j].type === 'text') {
                        const block_texts =
                            blocks_info[j].properties.text.value;
                        texts.push(...block_texts);
                    }
                }
            }
            return [
                {
                    type: this.type,
                    properties: {
                        text: { value: texts },
                    },
                    children: [],
                },
            ];
        }

        return null;
    }

    override async block2html(props: Block2HtmlProps) {
        return `<blockquote>${await commonBlock2HtmlContent(
            props
        )}</blockquote>`;
    }
}

export class CalloutBlock extends BaseView {
    type = Protocol.Block.Type.callout;

    View: (prop: CreateView) => JSX.Element = TextView;

    // override ChildrenView = IndentWrapper;

    override async onCreate(block: AsyncBlock): Promise<AsyncBlock> {
        if (!block.getProperty('text')) {
            await block.setProperty('text', {
                value: [{ text: '' }],
            });
        }
        return block;
    }

    override html2block(
        el: Element,
        parseEl: (el: Element) => any[]
    ): any[] | null {
        const tag_name = el.tagName;
        if (
            tag_name === 'ASIDE' ||
            el.firstChild?.nodeValue?.startsWith('<aside>')
        ) {
            const childNodes = el.childNodes;
            let texts = [];
            for (let i = 0; i < childNodes.length; i++) {
                const blocks_info = parseEl(childNodes[i] as Element);
                for (let j = 0; j < blocks_info.length; j++) {
                    if (blocks_info[j].type === 'text') {
                        const block_texts =
                            blocks_info[j].properties.text.value;
                        texts.push(...block_texts);
                    }
                }
            }
            if (
                texts.length > 0 &&
                (texts[0].text || '').startsWith('<aside>')
            ) {
                texts[0].text = texts[0].text.substring('<aside>'.length);
                if (!texts[0].text) {
                    texts = texts.slice(1);
                }
            }
            return [
                {
                    type: this.type,
                    properties: {
                        text: { value: texts },
                    },
                    children: [],
                },
            ];
        }

        if (el.firstChild?.nodeValue?.startsWith('</aside>')) {
            return [];
        }

        return null;
    }

    override async block2html(props: Block2HtmlProps) {
        return `<aside>${await commonBlock2HtmlContent(props)}</aside>`;
    }
}
