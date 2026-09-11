export const methodData = {
    drip: {
        heroImage: 'https://images.unsplash.com/photo-1775568109786-18598bf7b294?w=1440&h=600&fit=crop&auto=format',
        factIcons: [
            'fa-solid fa-leaf',
            'fa-solid fa-droplet',
            'fa-solid fa-wrench',
            'fa-solid fa-carrot'
        ],
        suitableImages: [
            { src: 'https://images.unsplash.com/photo-1631981798865-e0216d05b443?w=400&h=300&fit=crop&auto=format', key: 'suitable0' },
            { src: 'https://images.unsplash.com/photo-1777383504655-3728eacd2e27?w=400&h=300&fit=crop&auto=format', key: 'suitable1' },
            { src: 'https://images.unsplash.com/photo-1702995878564-17fef6fa4e57?w=400&h=300&fit=crop&auto=format', key: 'suitable2' },
            { src: 'https://images.unsplash.com/photo-1640677117376-573b9dbb8ea8?w=400&h=300&fit=crop&auto=format', key: 'suitable3' },
        ],
        flowIcons: [
            'fa-solid fa-faucet',
            'fa-solid fa-filter',
            'fa-solid fa-gear',
            'fa-solid fa-grip-lines',
            'fa-solid fa-droplet',
        ],
        componentIcons: [
            'fa-solid fa-filter',
            'fa-solid fa-gear',
            'fa-solid fa-grip-lines',
            'fa-solid fa-link',
            'fa-solid fa-droplet',
            'fa-solid fa-circle-stop',
        ],
        componentCount: 6,
        plannerFields: [
            { id: 'area', labelKey: 'planner.drip.areaLabel', unitKey: 'planner.drip.areaUnit', min: 10, max: 150, step: 5, defaultValue: 40 },
            { id: 'rows', labelKey: 'planner.drip.rowsLabel', unitKey: 'planner.drip.rowsUnit', min: 1, max: 20, step: 1, defaultValue: 5 },
            { id: 'distance', labelKey: 'planner.drip.distanceLabel', unitKey: 'planner.drip.distanceUnit', min: 5, max: 80, step: 5, defaultValue: 20 },
        ],
        computePlanner(values) {
            const pipeLength = Math.ceil(values.rows * (values.area / values.rows) + values.distance * 1.1);
            const zones = Math.max(1, Math.ceil(values.area / 60));
            return [
                { labelKey: 'planner.drip.resultPipe', value: `${pipeLength} planner.drip.distanceUnit` },
                { labelKey: 'planner.drip.resultZones', value: zones, countKey: zones > 1 ? 'planner.drip.zonesUnit' : 'planner.drip.zoneUnit' },
            ];
        },
        systemFeatureCounts: [4, 4, 4],
        faqCount: 5,
    },

    micro: {
        heroImage: 'https://images.unsplash.com/photo-1745415271518-e3844abfec58?w=1440&h=600&fit=crop&auto=format',
        factIcons: [
            'fa-solid fa-seedling',
            'fa-solid fa-droplet',
            'fa-solid fa-wrench',
            'fa-solid fa-spa'
        ],
        suitableImages: [
            { src: 'https://images.unsplash.com/photo-1597029105747-38a3e1c8ab12?w=400&h=300&fit=crop&auto=format', key: 'suitable0' },
            { src: 'https://images.unsplash.com/photo-1766934978628-199c14ae0233?w=400&h=300&fit=crop&auto=format', key: 'suitable1' },
            { src: 'https://images.unsplash.com/photo-1777383504655-3728eacd2e27?w=400&h=300&fit=crop&auto=format', key: 'suitable2' },
            { src: 'https://images.unsplash.com/photo-1640677117376-573b9dbb8ea8?w=400&h=300&fit=crop&auto=format', key: 'suitable3' },
        ],
        flowIcons: [
            'fa-solid fa-faucet',
            'fa-solid fa-filter',
            'fa-solid fa-gear',
            'fa-solid fa-grip-lines',
            'fa-solid fa-seedling',
            'fa-solid fa-sun',
        ],
        componentIcons: [
            'fa-solid fa-filter',
            'fa-solid fa-gear',
            'fa-solid fa-grip-lines',
            'fa-solid fa-seedling',
            'fa-solid fa-sun',
            'fa-solid fa-thumbtack',
        ],
        componentCount: 6,
        plannerFields: [
            { id: 'pots', labelKey: 'planner.micro.potsLabel', unitKey: 'planner.micro.potsUnit', min: 4, max: 60, step: 2, defaultValue: 12 },
            { id: 'spacing', labelKey: 'planner.micro.spacingLabel', unitKey: 'planner.micro.spacingUnit', min: 20, max: 200, step: 10, defaultValue: 60 },
            { id: 'groups', labelKey: 'planner.micro.groupsLabel', unitKey: 'planner.micro.groupsUnit', min: 1, max: 6, step: 1, defaultValue: 2 },
        ],
        computePlanner(values) {
            const tubeLength = Math.ceil(values.pots * values.spacing / 100 * 1.2);
            const emitters = values.pots;
            const zones = values.groups;
            return [
                { labelKey: 'planner.micro.resultTube', value: `${tubeLength} planner.micro.spacingUnit` },
                { labelKey: 'planner.micro.resultEmitters', value: `${emitters} planner.micro.potsUnit` },
                { labelKey: 'planner.micro.resultZones', value: zones, countKey: zones > 1 ? 'planner.micro.zonesUnit' : 'planner.micro.zoneUnit' },
            ];
        },
        systemFeatureCounts: [3, 3, 3],
        faqCount: 4,
    },

    sprinkler: {
        heroImage: 'https://images.unsplash.com/photo-1781090347265-8b59f94375dd?w=1440&h=600&fit=crop&auto=format',
        factIcons: [
            'fa-solid fa-hill-rockslide',
            'fa-solid fa-droplet',
            'fa-solid fa-wrench',
            'fa-solid fa-house'
        ],
        suitableImages: [
            { src: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?w=400&h=300&fit=crop&auto=format', key: 'suitable0' },
            { src: 'https://images.unsplash.com/photo-1588701047364-ebd987f3166d?w=400&h=300&fit=crop&auto=format', key: 'suitable1' },
            { src: 'https://images.unsplash.com/photo-1492185244344-91fde303149e?w=400&h=300&fit=crop&auto=format', key: 'suitable2' },
            { src: 'https://images.unsplash.com/photo-1724893972463-c5744b496ee5?w=400&h=300&fit=crop&auto=format', key: 'suitable3' },
        ],
        flowIcons: [
            'fa-solid fa-display',
            'fa-solid fa-circle-dot',
            'fa-solid fa-grip-lines',
            'fa-solid fa-link',
            'fa-solid fa-shower',
        ],
        componentIcons: [
            'fa-solid fa-display',
            'fa-solid fa-circle-dot',
            'fa-solid fa-grip-lines',
            'fa-solid fa-link',
            'fa-solid fa-shower',
            'fa-solid fa-box',
        ],
        componentCount: 6,
        plannerFields: [
            { id: 'area', labelKey: 'planner.sprinkler.areaLabel', unitKey: 'planner.sprinkler.areaUnit', min: 50, max: 800, step: 25, defaultValue: 150 },
            { id: 'flow', labelKey: 'planner.sprinkler.flowLabel', unitKey: 'planner.sprinkler.flowUnit', min: 5, max: 40, step: 1, defaultValue: 15 },
            { id: 'radius', labelKey: 'planner.sprinkler.radiusLabel', unitKey: 'planner.sprinkler.radiusUnit', min: 2, max: 6, step: 0.5, defaultValue: 3.5 },
        ],
        computePlanner(values) {
            const coverage = Math.PI * values.radius * values.radius * 0.75;
            const heads = Math.ceil(values.area / coverage);
            const zones = Math.max(1, Math.ceil(heads * 1.5 / values.flow));
            return [
                { labelKey: 'planner.sprinkler.resultHeads', value: `${heads} planner.sprinkler.radiusUnit` },
                { labelKey: 'planner.sprinkler.resultZones', value: zones, countKey: zones > 1 ? 'planner.sprinkler.zonesUnit' : 'planner.sprinkler.zoneUnit' },
            ];
        },
        systemFeatureCounts: [4, 4, 4],
        faqCount: 5,
        hydraulicNote: true,
    },
    subsurface: {
        heroImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1440&h=600&fit=crop&auto=format',
        factIcons: [
            'fa-solid fa-wheat-awn',
            'fa-solid fa-droplet',
            'fa-solid fa-person-digging',
            'fa-solid fa-seedling'
        ],
        suitableImages: [
            { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop&auto=format', key: 'suitable0' },
            { src: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop&auto=format', key: 'suitable1' },
            { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format', key: 'suitable2' },
            { src: 'https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=400&h=300&fit=crop&auto=format', key: 'suitable3' },
        ],
        flowIcons: [
            'fa-solid fa-faucet',
            'fa-solid fa-filter',
            'fa-solid fa-gear',
            'fa-solid fa-grip-lines',
            'fa-solid fa-arrow-down',
            'fa-solid fa-seedling',
        ],
        componentIcons: [
            'fa-solid fa-filter',
            'fa-solid fa-gear',
            'fa-solid fa-grip-lines',
            'fa-solid fa-droplet',
            'fa-solid fa-wind',
            'fa-solid fa-circle-stop',
        ],
        componentCount: 6,
        plannerFields: [
            { id: 'area', labelKey: 'planner.subsurface.areaLabel', unitKey: 'planner.subsurface.areaUnit', min: 20, max: 1000, step: 10, defaultValue: 200 },
            { id: 'spacing', labelKey: 'planner.subsurface.spacingLabel', unitKey: 'planner.subsurface.spacingUnit', min: 30, max: 100, step: 5, defaultValue: 60 },
            { id: 'depth', labelKey: 'planner.subsurface.depthLabel', unitKey: 'planner.subsurface.depthUnit', min: 15, max: 45, step: 5, defaultValue: 25 },
        ],
        computePlanner(values) {
            const rowSpacingM = values.spacing / 100;
            const fieldWidth = Math.sqrt(values.area);
            const rows = Math.ceil(fieldWidth / rowSpacingM);
            const lateralLength = Math.ceil(rows * fieldWidth * 1.05);
            const emitters = Math.ceil(lateralLength / 0.35);
            return [
                { labelKey: 'planner.subsurface.resultLateral', value: `${lateralLength} planner.subsurface.spacingUnit` },
                { labelKey: 'planner.subsurface.resultEmitters', value: `${emitters} planner.subsurface.resultEmittersUnit` },
            ];
        },
        systemFeatureCounts: [4, 4, 4],
        faqCount: 5,
    },
};