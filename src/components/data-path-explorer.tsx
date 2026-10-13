'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Background,
  BaseEdge,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  getBezierPath,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import { motion, useReducedMotion } from 'framer-motion'
import { concepts } from '../data/curriculum'
import { scenarios, type Scenario, type ScenarioNode, type ScenarioStep } from '../data/scenarios'

type FlowNodeData = Record<string, unknown> & ScenarioNode & { conceptName: string; active: boolean }
type FlowEdgeData = Record<string, unknown> & ScenarioStep & { active: boolean; reducedMotion: boolean }
type FlowNode = Node<FlowNodeData, 'scenario'>
type FlowEdge = Edge<FlowEdgeData, 'scenario'>

function ScenarioNodeView({ data }: NodeProps<FlowNode>) {
  return <div className={`scenario-node-visual ${data.observableFromBrowser ? 'is-observable' : 'is-internal'} ${data.active ? 'is-current' : ''}`} aria-hidden="true">
    <Handle type="target" position={Position.Left} className="flow-handle" />
    <span className="scenario-node-zone">{data.zone}</span>
    <strong>{data.label}</strong>
    <span className={`visibility-label ${data.observableFromBrowser ? 'visible-label' : 'internal-label'}`}>{data.observableFromBrowser ? 'Observable côté navigateur' : 'Non visible depuis le navigateur'}</span>
    <span className="scenario-node-concept">Concept : {data.conceptName}</span>
    <Handle type="source" position={Position.Right} className="flow-handle" />
  </div>
}

function ScenarioEdgeView({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps<FlowEdge>) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
  const active = Boolean(data?.active)
  const internal = !data?.observableFromBrowser
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2
  return <>
    <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ stroke: internal ? '#969b91' : '#477a59', strokeWidth: active ? 2.5 : 1.5, strokeDasharray: internal ? '6 5' : undefined }} />
    {active && <motion.circle
      className="data-packet"
      r="6"
      fill={internal ? '#8a8e86' : '#dd7849'}
      initial={{ cx: sourceX, cy: sourceY, opacity: 0 }}
      animate={{ cx: [sourceX, midX, targetX], cy: [sourceY, midY, targetY], opacity: [0, 1, 1, 0] }}
      transition={{ duration: data?.reducedMotion ? 0.01 : 1.15, ease: 'easeInOut' }}
      aria-hidden="true"
    />}
  </>
}

const nodeTypes = { scenario: ScenarioNodeView }
const edgeTypes = { scenario: ScenarioEdgeView }

export function DataPathExplorer() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id)
  const [stepIndex, setStepIndex] = useState(-1)
  const reducedMotion = useReducedMotion()
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0]

  const nodes = useMemo<FlowNode[]>(() => scenario.nodes.map((node) => ({
    id: node.id,
    type: 'scenario',
    position: node.position,
    data: {
      ...node,
      conceptName: concepts.find((concept) => concept.id === node.conceptId)?.name ?? node.conceptId,
      active: scenario.steps[stepIndex]?.from === node.id || scenario.steps[stepIndex]?.to === node.id,
    },
    draggable: false,
    selectable: false,
  })), [scenario, stepIndex])

  const edges = useMemo<FlowEdge[]>(() => scenario.steps.map((step, index) => ({
    id: `step-${index}-${step.from}-${step.to}`,
    source: step.from,
    target: step.to,
    type: 'scenario',
    markerEnd: { type: MarkerType.ArrowClosed, color: step.observableFromBrowser ? '#477a59' : '#969b91' },
    data: { ...step, active: stepIndex === index, reducedMotion: Boolean(reducedMotion) },
  })), [reducedMotion, scenario, stepIndex])

  const currentStep = scenario.steps[stepIndex]
  const setScenario = (id: string) => {
    setScenarioId(id)
    setStepIndex(-1)
  }
  const next = useCallback(() => {
    setStepIndex((current) => Math.min(current + 1, scenario.steps.length - 1))
  }, [scenario.steps.length])
  const previous = () => setStepIndex((current) => Math.max(current - 1, 0))
  const restart = () => setStepIndex(-1)

  return <div className="data-path-explorer">
    <section className="path-intro" aria-labelledby="path-page-title">
      <div className="eyebrow section-eyebrow">VISUALISER LE TRAJET</div>
      <h1 id="path-page-title">Du clic à la réponse, <em>et ce qu’on ne voit pas.</em></h1>
      <p>Choisis une situation, puis suis la requête et la réponse. Le diagramme sépare ce que le navigateur peut observer de ce qui se passe à l’intérieur du serveur.</p>
    </section>

    <fieldset className="scenario-picker">
      <legend>Choisir une situation</legend>
      <div className="scenario-options">
        {scenarios.map((item) => <label className={`scenario-option ${scenarioId === item.id ? 'selected' : ''}`} key={item.id}>
          <input type="radio" name="scenario" value={item.id} checked={scenarioId === item.id} onChange={() => setScenario(item.id)} />
          <span><strong>{item.title}</strong><small>{item.method}</small><span className="scenario-option-result">{item.observableResult}</span></span>
        </label>)}
      </div>
    </fieldset>

    <section className="scenario-summary" aria-labelledby="scenario-title">
      <div><span className="scenario-method">{scenario.method}</span><h2 id="scenario-title">{scenario.title}</h2><p>{scenario.description}</p><p className="observable-result"><strong>Réponse observable possible :</strong> {scenario.observableResult}</p></div>
      <div className="visibility-legend" aria-label="Légende d’observabilité"><span><i className="legend-visible" /> Observable depuis le navigateur</span><span><i className="legend-internal" /> Interne, non visible directement</span></div>
    </section>

    <section className="flow-section" aria-label={`Diagramme illustratif du scénario ${scenario.title}`}>
      <div className="flow-canvas" aria-hidden="true">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView fitViewOptions={{ padding: 0.16, minZoom: 0.45, maxZoom: 0.85 }} minZoom={0.35} maxZoom={1.1} zoomOnDoubleClick={false} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} panOnDrag proOptions={{ hideAttribution: true }}>
          <Background color="#e3e5de" gap={20} />
        </ReactFlow>
      </div>
      <div className="flow-legend"><span><i className="legend-visible" /> Ce que le navigateur peut montrer</span><span><i className="legend-internal" /> Modèle interne, non observable directement</span></div>
    </section>

    <section className="flow-controls" aria-label="Commandes de lecture du scénario">
      <button type="button" className="button button-light" onClick={restart}>Recommencer</button>
      <button type="button" className="button button-light" onClick={previous} disabled={stepIndex <= 0}>Étape précédente</button>
      <button type="button" className="button button-dark" onClick={next} disabled={stepIndex >= scenario.steps.length - 1}>{reducedMotion ? 'Avancer sans animation' : 'Avancer d’une étape'}</button>
      <span className="step-count">{stepIndex < 0 ? 'Prêt à démarrer' : `Étape ${stepIndex + 1} sur ${scenario.steps.length}`}</span>
    </section>
    <p className="sr-only" aria-live="polite">{currentStep ? `${currentStep.label}. ${currentStep.payload}. ${currentStep.observableFromBrowser ? 'Observable depuis le navigateur.' : `Non observable depuis le navigateur. ${currentStep.visibilityNote}`}` : `Scénario ${scenario.title} sélectionné. ${scenario.steps.length} étapes.`}</p>

    <section className="scenario-transcript" aria-labelledby="transcript-title">
      <div className="section-heading"><div><div className="eyebrow section-eyebrow">ALTERNATIVE TEXTUELLE</div><h2 id="transcript-title">Le déroulé, étape par étape</h2><p>Cette liste décrit le même scénario sans dépendre du diagramme ou de l’animation.</p></div></div>
      <ol className="transcript-list">{scenario.steps.map((step, index) => <li className={`transcript-step ${step.observableFromBrowser ? 'transcript-observable' : 'transcript-internal'} ${stepIndex === index ? 'transcript-current' : ''}`} key={`${step.from}-${step.to}-${index}`}>
        <span className="transcript-index">{String(index + 1).padStart(2, '0')}</span>
        <div className="transcript-copy"><strong>{step.label}</strong><p>{step.payload}</p><span className={`visibility-label ${step.observableFromBrowser ? 'visible-label' : 'internal-label'}`}>{step.observableFromBrowser ? 'Observable depuis le navigateur' : 'Non visible depuis le navigateur'}</span><p className="visibility-note">{step.visibilityNote}</p><div className="transcript-links">{[step.from, step.to].map((nodeId) => scenario.nodes.find((node) => node.id === nodeId)).filter((node): node is ScenarioNode => Boolean(node)).map((node) => <Link key={node.id} href={`/lecons/${node.lessonId}`}><span>{concepts.find((concept) => concept.id === node.conceptId)?.name ?? node.conceptId}</span><span className="sr-only">, ouvrir la leçon</span></Link>)}</div></div>
      </li>)}</ol>
    </section>

    <p className="path-caution"><strong>À retenir :</strong> les étapes internes sont un modèle pédagogique. Pour savoir ce qu’un serveur fait réellement, il faut une documentation ou un accès autorisé à son code et à ses journaux. Une réponse HTTP seule ne révèle pas ses requêtes SQL ni son stockage.</p>
  </div>
}
