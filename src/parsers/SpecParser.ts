import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, Heading, Paragraph, List } from 'mdast';
import {
  ParsedSpec,
  Phase,
  Capability,
  Dependency,
  DecisionFramework,
  SuccessMetric,
  PeopleAction,
  PhaseStatus,
  Priority,
  CapabilityStatus,
  DependencyType,
  MetricCategory,
  MeasurementFrequency,
  SpecMetadata
} from '../types/models';
import { validateSpec } from '../utils/validation';

export class SpecParser {
  async parseSpecFile(filePath: string): Promise<ParsedSpec> {
    try {
      const content = await this.fetchFile(filePath);
      const markdown = this.stripFrontmatter(content);
      
      const tree = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(markdown);

      const phases = this.extractPhases(tree);
      const capabilities = this.extractCapabilities(tree, phases);
      const dependencies = this.extractDependencies(capabilities);
      
      const spec: ParsedSpec = {
        metadata: this.extractMetadata(content),
        phases,
        capabilities,
        dependencies,
        successMetrics: [],
        peopleActions: []
      };

      // Validate spec
      const errors = validateSpec(spec);
      if (errors.length > 0) {
        console.warn('Validation warnings:', errors);
      }

      return spec;
    } catch (error) {
      throw new Error(`Failed to parse spec file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private stripFrontmatter(content: string): string {
    // Remove YAML frontmatter if present
    if (content.startsWith('---')) {
      const endIndex = content.indexOf('---', 3);
      if (endIndex !== -1) {
        return content.substring(endIndex + 3);
      }
    }
    return content;
  }

  private async fetchFile(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`File not found: ${path}`);
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch file ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  extractPhases(tree: Root): Phase[] {
    const phases: Phase[] = [];
    let currentPhase: Partial<Phase> | null = null;
    let phaseContent: string[] = [];

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type === 'heading' && node.depth === 2) {
        if (currentPhase) {
          currentPhase.description = phaseContent.join('\n').trim();
          phases.push(currentPhase as Phase);
        }

        const text = this.extractText(node);
        const match = text.match(/Fase\s+(\d+):\s*(.+)/i);
        
        if (match) {
          const order = parseInt(match[1]);
          currentPhase = {
            id: `phase-${order}`,
            name: match[2].trim(),
            description: '',
            order,
            status: PhaseStatus.NOT_STARTED,
            estimatedDuration: '',
            transitionCriteria: []
          };
          phaseContent = [];
        }
      } else if (currentPhase && node.type === 'paragraph') {
        phaseContent.push(this.extractText(node));
      } else if (currentPhase && node.type === 'list') {
        const criteria = this.extractListItems(node);
        if (criteria.length > 0) {
          currentPhase.transitionCriteria = criteria;
        }
      }
    }

    if (currentPhase) {
      currentPhase.description = phaseContent.join('\n').trim();
      phases.push(currentPhase as Phase);
    }

    return phases;
  }

  extractCapabilities(tree: Root, phases: Phase[]): Capability[] {
    const capabilities: Capability[] = [];
    let currentPhaseId = '';

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type === 'heading' && node.depth === 2) {
        const text = this.extractText(node);
        const match = text.match(/Fase\s+(\d+)/i);
        if (match) {
          currentPhaseId = `phase-${match[1]}`;
        }
      }

      if (node.type === 'heading' && node.depth === 4) {
        const text = this.extractText(node);
        const match = text.match(/CAP-(\d+\.\d+):\s*(.+)/i);
        
        if (match && currentPhaseId) {
          const capId = match[1];
          const description = this.extractFollowingText(tree, i);
          
          capabilities.push({
            id: `cap-${capId}`,
            phaseId: currentPhaseId,
            name: match[2].trim(),
            description,
            priority: this.extractPriority(description),
            status: CapabilityStatus.NOT_STARTED,
            dependencies: this.extractCapabilityDependencies(description),
            deliverables: this.extractDeliverables(tree, i)
          });
        }
      }
    }

    return capabilities;
  }

  extractDependencies(capabilities: Capability[]): Dependency[] {
    const dependencies: Dependency[] = [];

    capabilities.forEach(cap => {
      cap.dependencies.forEach(depId => {
        dependencies.push({
          sourceId: cap.id,
          targetId: depId,
          type: DependencyType.REQUIRES
        });
      });
    });

    return dependencies;
  }

  async extractDecisionFramework(filePath: string): Promise<DecisionFramework> {
    try {
      const content = await this.fetchFile(filePath);
      const tree = unified().use(remarkParse).use(remarkGfm).parse(content);

      return {
        flexible: [],
        nonNegotiable: [],
        escalationCriteria: [],
        decisionMakers: []
      };
    } catch (error) {
      throw new Error(`Failed to parse decision framework: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async extractSuccessMetrics(filePath: string): Promise<SuccessMetric[]> {
    try {
      const content = await this.fetchFile(filePath);
      const tree = unified().use(remarkParse).use(remarkGfm).parse(content);

      const metrics: SuccessMetric[] = [];
      // Parse metrics from markdown structure
      return metrics;
    } catch (error) {
      throw new Error(`Failed to parse success metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractMetadata(content: string): SpecMetadata {
    // Simple frontmatter parsing
    const metadata: SpecMetadata = {
      title: 'Platform Leadership Challenge Roadmap',
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    };

    if (content.startsWith('---')) {
      const endIndex = content.indexOf('---', 3);
      if (endIndex !== -1) {
        const frontmatter = content.substring(3, endIndex);
        const titleMatch = frontmatter.match(/title:\s*(.+)/);
        const versionMatch = frontmatter.match(/version:\s*(.+)/);
        
        if (titleMatch) metadata.title = titleMatch[1].trim();
        if (versionMatch) metadata.version = versionMatch[1].trim();
      }
    }

    return metadata;
  }

  private extractText(node: any): string {
    if (node.type === 'text') return node.value;
    if (node.children) {
      return node.children.map((child: any) => this.extractText(child)).join('');
    }
    return '';
  }

  private extractListItems(node: List): string[] {
    return node.children.map(item => {
      if (item.type === 'listItem' && item.children) {
        return item.children.map(child => this.extractText(child)).join('').trim();
      }
      return '';
    }).filter(Boolean);
  }

  private extractFollowingText(tree: Root, startIndex: number): string {
    const texts: string[] = [];
    for (let i = startIndex + 1; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'heading') break;
      if (node.type === 'paragraph') {
        texts.push(this.extractText(node));
      }
    }
    return texts.join('\n').trim();
  }

  private extractPriority(text: string): Priority {
    const lower = text.toLowerCase();
    if (lower.includes('critical') || lower.includes('crítico')) return Priority.CRITICAL;
    if (lower.includes('high') || lower.includes('alta')) return Priority.HIGH;
    if (lower.includes('medium') || lower.includes('media')) return Priority.MEDIUM;
    return Priority.LOW;
  }

  private extractCapabilityDependencies(text: string): string[] {
    const deps: string[] = [];
    const matches = text.matchAll(/CAP-(\d+\.\d+)/gi);
    for (const match of matches) {
      deps.push(`cap-${match[1]}`);
    }
    return deps;
  }

  private extractDeliverables(tree: Root, startIndex: number): string[] {
    for (let i = startIndex + 1; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'heading') break;
      if (node.type === 'list') {
        return this.extractListItems(node);
      }
    }
    return [];
  }
}
