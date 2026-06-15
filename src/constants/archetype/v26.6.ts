import type { ArchetypeVersion } from './index';

const version: ArchetypeVersion = {
    id: 'v26.6',
    label: '2026年6月/誅神弒滅者 S2',
    archetypes: [
        // ── 精靈（classId: 1）─────────────────────────────────────
        {
            id: 'Evolution Forestcraft',
            name: '進化精靈',
            classId: 1,
            description: '',
            coreCards: [],
            flexCards: [],
        },

        // ── 皇家護衛（classId: 2）─────────────────────────────────
        {
            id: 'Swordcraft',
            name: '快攻皇家護衛',
            classId: 2,
            description: '',
            coreCards: [],
            flexCards: [],
        },

        // ── 巫師（classId: 3）─────────────────────────────────────
        {
            id: 'Dirt-Runecraft',
            name: '土之秘術巫師',
            classId: 3,
            description: '',
            coreCards: [
                10732120, // 俏麗的捕食者
                10732110, // 魅力飛怪
                10434120, // 天才美少女鍊金術師‧卡莉歐斯托蘿
                10432120, // 艱辛的旅程‧米蕾羽＆麗婕特
                10733110, // 詭甜的化身
                10234120, // 堅定的鍊金術師‧諾曼
                10404110, // 天司長的後繼者‧聖德芬
                10734110, // 萬食的弒滅者‧菈菈安瑟姆
                10234110, // 暴食的弒滅者‧菈菈安瑟姆
                10734120, // 迷人的傑作
            ],
            flexCards: [
                10433310, // 鍊金爆炎
                10732310, // 暴食的點心
                10733310, // 貪食的魔力
            ],
        },

        // ── 龍族（classId: 4）─────────────────────────────────────
        {
            id: 'Ramp Dragoncraft',
            name: '跳費龍族',
            classId: 4,
            description: '',
            coreCards: [],
            flexCards: [],
        },

        // ── 夜魔（classId: 5）─────────────────────────────────────
        {
            id: 'Midrange Abysscraft',
            name: '中速夜魔',
            classId: 5,
            description: '',
            coreCards: [
                10754110, // 徒姬
                10754120, // 馬可米蘭
                10354120, // 沉默x愛絕
            ],
            flexCards: [],
        },
        {
            id: 'Evolution Abysscraft',
            name: '進化夜魔',
            classId: 5,
            description: '',
            coreCards: [
                10403110, // 葛蘭姬塔
                10404110, // 聖德芬
                10453110, // 涅槃
                10454110, // 闇龍
                10454120, // 彼列
            ],
            flexCards: [],
        },
        {
            id: 'Milteo Abysscraft',
            name: '戀人夜魔',
            classId: 5,
            description: '',
            coreCards: [
                10554110, // 戀人與節制
                10303110, // 滿懷勇氣的少女
            ],
            flexCards: [],
        },

        // ── 主教（classId: 6）─────────────────────────────────────
        {
            id: 'heaven-control',
            name: '控制主教',
            classId: 6,
            description: '',
            coreCards: [],
            flexCards: [],
        },

        // ── 復仇者（classId: 7）───────────────────────────────────
        {
            id: 'Artifact Portalcraft',
            name: '創造物復仇者',
            classId: 7,
            description: '',
            coreCards: [
                10271210, // 創造物彈射裝置
                10272310, // 伊卡洛斯的飛翔
                10771310, // 街頭疾走
                10471130, // 報恩的技師‧艾札克
                10674120, // 古老天斧‧尤格傑特
                10772110, // 自在的滑板玩家
                10773110, // 野性的播報員
                10572110, // 次世代地理學家
                10274120, // 心魂武藝‧迦爾拉
                10774110, // 虛刻的弒滅者‧史考雷特
            ],
            flexCards: [
                10774120, // 奮勉奔逐‧妙
                10473110, // 思慕蒼空的歸還者‧卡希烏斯
            ],
        },
        {
            id: 'Lishenna Portalcraft',
            name: '里榭娜復仇者',
            classId: 7,
            description: '',
            coreCards: [
                10503210, // 大遊戲世界
                10372210, // 破壞的荒野
                10373310, // 殲滅的歌聲
                10374110, // 破壞的繼承者‧阿克西雅
                10374120, // 奏絕的顯現‧里榭娜
                10373110, // 破壞的團結者
                10474120, // 統世之王‧巴力巴布
            ],
            flexCards: [
                10204110, // 命運的黃昏‧奧丁
            ],
        },
    ],
};

export default version;
