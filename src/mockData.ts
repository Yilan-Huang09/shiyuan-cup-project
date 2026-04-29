import { SimulationStep } from './types';

export const simulationSteps: SimulationStep[] = [
  { // 0: Init
    id: 0,
    messages: [
      {
        id: 'msg_0_1',
        role: 'teacher',
        content: '同学们好！今天我们来学习一个非常重要的物理概念——**动量定理**与**动量守恒**。大家可以先看一下右侧的材料。',
        source: { id: 'ppt_1', title: '动量定理 PPT', page: 'Page 2' }
      },
      {
        id: 'msg_0_2',
        role: 'assistant',
        content: '大家好，我是**助教** 📝。我会实时根据老师的讲解在左侧白板上生成重要的知识卡片和互动组件，并为大家提炼核心考点。',
      }
    ],
    newCards: []
  },
  { // 1: Concept
    id: 1,
    messages: [
      {
        id: 'msg_1_1',
        role: 'student_a',
        content: '老师，我经常搞混“动量”和“冲量”，它们在公式上的区别我懂，但在实际物理意义上到底有什么区别呀？',
      },
      {
        id: 'msg_1_2',
        role: 'student_b',
        content: '对对对，而且这两个词听起来太像了，做题的时候很容易把它们带错公式，有什么快速记忆的方法吗？',
      },
      {
        id: 'msg_1_3',
        role: 'teacher',
        content: '好问题！简单来说，**动量**是物体的运动状态（质量乘以速度，$p=mv$），可以理解为“具有的运动量”；而**冲量**是力在时间上的积累（力乘以时间，$I=Ft$），它是外力对物体作用的过程量。冲量是导致动量变化的原因！',
        source: { id: 'ppt_2', title: '动量定理 PPT', page: 'Page 3', highlight: '冲量的定义' }
      },
      {
        id: 'msg_1_4',
        role: 'assistant',
        content: '检测到核心概念，已为大家生成卡片【动量与冲量基础】。',
      }
    ],
    newCards: [
      {
        id: 'card_1',
        type: 'knowledge',
        title: '动量与冲量基础',
        content: '动量 ($p=mv$) 代表运动状态；\n冲量 ($I=Ft$) 是力在时间上的积累，是导致动量变化的原因。',
        tags: ['基础概念'],
        sourceId: 'PPT p.3',
        x: 60,
        y: 60
      }
    ]
  },
  { // 2: Formula
    id: 2,
    messages: [
      {
        id: 'msg_2_1',
        role: 'teacher',
        content: '接下来看公式。合外力的冲量，等于物体动量的变化量。这就是动量定理。公式写作：\n$$ I = \\Delta p $$',
        source: { id: 'ppt_3', title: '动量定理 PPT', page: 'Page 4' }
      },
      {
        id: 'msg_2_2',
        role: 'student_a',
        content: '那如果受力不是恒定的呢？比如打网球那一瞬间的力是不断变化的，这还能用 $F \\cdot t$ 算吗？',
      },
      {
        id: 'msg_2_3',
        role: 'student_b',
        content: '还有一点我想确认，因为速度有方向，那动量和冲量肯定也是矢量吧？所以在套公式之前是不是必须先规定正方向？',
      },
      {
        id: 'msg_2_4',
        role: 'teacher',
        content: '你们考虑得非常全面！如果力是非恒定的，$F$ 就代表平均力；而且动量和冲量确实都是**矢量**，计算时如果不规定正方向，是绝对会算错的！'
      },
      {
        id: 'msg_2_5',
        role: 'assistant',
        content: '两位虚拟同学提到了极易出错的考点，我已经把公式和易错点卡片贴到白板上了，大家注意查看！',
      }
    ],
    newCards: [
      {
        id: 'card_2',
        type: 'knowledge',
        title: '动量定理公式',
        content: '合外力的冲量等于物体动量的变化。',
        formula: '$$ I = \\Delta p \\quad (即\\ \\vec{F}t = m\\vec{v}_2 - m\\vec{v}_1) $$',
        tags: ['核心公式'],
        sourceId: 'PPT p.4',
        x: 360,
        y: 60
      },
      {
        id: 'card_3',
        type: 'knowledge',
        title: '动量定理适用条件与易错点',
        pitfall: '动量是矢量！千万不要忘记规定正方向。非恒力情况下，$\\vec{F}$ 为平均作用力。',
        tags: ['易错点'],
        sourceId: 'PPT p.5',
        x: 60,
        y: 260
      }
    ]
  },
  { // 3: Simulator
    id: 3,
    messages: [
      {
        id: 'msg_3_1',
        role: 'teacher',
        content: '为了让大家直观感受，我给大家推了一个互动演示模块。大家可以自己在白板上拖动试试完全非弹性碰撞。',
      },
      {
        id: 'msg_3_2',
        role: 'assistant',
        content: '互动组件【碰撞车模拟器】已投放。',
      }
    ],
    newCards: [
      {
        id: 'card_comp',
        type: 'simulator',
        simulatorType: 'collision',
        title: '互动试验：动量守恒完全非弹性碰撞',
        x: 360,
        y: 260,
        width: 420,
      }
    ]
  },
  { // 4: Conservation Intro
    id: 4,
    messages: [
      {
        id: 'msg_4_1',
        role: 'teacher',
        content: '如果不是一个物体，而是两个物体相互碰撞呢？根据牛顿第三定律，它们之间的相互作用力大小相等方向相反，也就是说，它们在这个短暂过程中的冲量互相抵消了！',
      },
      {
        id: 'msg_4_2',
        role: 'student_a',
        content: '哦！那是不是意味着，如果外部没有任何力干扰它们，只看它们两个组成的系统，总动量就不会变？',
      },
      {
        id: 'msg_4_3',
        role: 'student_b',
        content: '如果系统受到了外力，但是合外力刚好抵消为零，这种情况是不是总动量也保持不变？',
      },
      {
        id: 'msg_4_4',
        role: 'teacher',
        content: '完全正确！只要系统所受**合外力为零**，则系统总动量保持不变。这就是大名鼎鼎的【动量守恒定律】。公式表示为：\n$$ m_1v_1 + m_2v_2 = m_1v_1\' + m_2v_2\' $$',
      },
      {
        id: 'msg_4_5',
        role: 'assistant',
        content: '已提炼核心知识卡片：【动量守恒定律】。',
      }
    ],
    newCards: [
      {
        id: 'card_conservation',
        type: 'knowledge',
        title: '动量守恒定律',
        content: '当系统所受**合外力为零**时，系统的总动量保持不变。这是自然界最普遍的守恒定律之一。',
        formula: '$$ \\sum p_{初} = \\sum p_{末} $$',
        tags: ['核心规律'],
        sourceId: 'PPT p.8',
        x: 700,
        y: 60
      }
    ]
  },
  { // 5: Collision Simulator
    id: 5,
    messages: [
      {
        id: 'msg_5_1',
        role: 'teacher',
        content: '刚才大家看到的只是碰后粘在一起的完全非弹性碰撞。如果它们发生的是【完全弹性碰撞】（即碰后分离，系统没有动能损失），动量依然守恒吗？结果会怎样呢？',
      },
      {
        id: 'msg_5_2',
        role: 'student_a',
        content: '既然没有外力，那动量肯定还是守恒的！而且动能也没有损失，那碰后的速度是不是和它们的质量比例有关？',
      },
      {
        id: 'msg_5_3',
        role: 'student_b',
        content: '如果是完全弹性碰撞，它们碰后肯定会互相弹开吧。好想亲眼看看具体的速度是怎么变化的。',
      },
      {
        id: 'msg_5_4',
        role: 'assistant',
        content: '安排！互动组件【完全弹性碰撞模拟器】已投放至白板，大家可以拖动参数亲自验证一下。',
      }
    ],
    newCards: [
      {
        id: 'card_sim_collision_elastic',
        type: 'simulator',
        simulatorType: 'collision',
        isElastic: true,
        title: '完全弹性碰撞演示',
        x: 700,
        y: 260,
      }
    ]
  },
  { // 6: Summary
    id: 6,
    messages: [
      {
        id: 'msg_6_1',
        role: 'teacher',
        content: '结合刚刚的弹性碰撞模拟器，大家现在有什么感想？',
      },
      {
        id: 'msg_6_2',
        role: 'student_a',
        content: '相互弹开后，虽然各自速度完全变了，但算出来的总动量真的没变！而且如果质量差别很大，反弹的速度也会很夸张，非常直观。',
      },
      {
        id: 'msg_6_3',
        role: 'student_b',
        content: '是的，我觉得解题的时候，只要分清是研究单个物体的受力，还是研究系统的碰撞，套用不同公式就很清晰了。',
      },
      {
        id: 'msg_6_4',
        role: 'assistant',
        content: '两位同学总结得很好！一是用 $Ft=\\Delta p$ 解决恒定或变化受力；二是利用 $\\sum p = \\text{const}$ 解决不受外力的系统问题。我已为大家生成本节课的全局脑图。',
      }
    ],
    newCards: [
      {
        id: 'card_summary',
        type: 'summary',
        title: '本讲小结：动量定理与守恒',
        content: '- **核心法则 1**: $I = \\Delta p$ (单一物体受力)\n- **核心法则 2**: $\\sum p_{初} = \\sum p_{末}$ (系统不受外力)\n- **极易犯错**: 未规定正方向、负号漏写\n- **实验验证**: 气垫导轨验证完全非弹性碰撞',
        x: 270,
        y: 500
      }
    ]
  },
  {
    // 7: Quiz (5 Questions)
    id: 7,
    messages: [
      {
        id: 'msg_7_1',
        role: 'teacher',
        content: '好的，趁热打铁，我们来完成 5 道随堂测试题，都是从刚才的【参考材料题库】中抽取的经典考法。',
      },
      {
        id: 'msg_7_2',
        role: 'student_a',
        content: '好，我先来试试，我最怕忘记规定正方向了，这次一定小心。',
      },
      {
        id: 'msg_7_3',
        role: 'student_b',
        content: '我也准备好了，看看谁答得快！',
      },
      {
        id: 'msg_7_4',
        role: 'assistant',
        content: '白板已推送 5 题测验组卡片，大家可以在白板上直接答题。',
      }
    ],
    newCards: [
      {
        id: 'card_quiz',
        type: 'quiz',
        title: '随堂题库连测',
        x: 720,
        y: 500,
        questions: [
          {
            question: '【基础】一个质量为 $0.2\\text{kg}$ 的小球以 $5\\text{m/s}$ 的速度垂直撞击墙面，随后以 $4\\text{m/s}$ 的速度反向弹回。求墙面对小球的冲量大小。',
            options: ['0.2 N·s', '1.8 N·s', '0.8 N·s', '1.0 N·s'],
            correctAnswer: 1,
            explanation: '规定初速度方向为正，$v_0=5\\text{m/s}$, $v_1=-4\\text{m/s}$。$\\Delta p = 0.2 \\times (-4 - 5) = -1.8 \\text{kg·m/s}$。冲量大小为 $1.8\\text{ N·s}$。'
          },
          {
            question: '【概念】关于动量和冲量，下列说法中正确的是？',
            options: [
              '动量越大的物体，受到的冲量也一定越大',
              '物体的动量变化方向，一定与它所受合外力的冲量方向相同',
              '动量守恒系统内，任何单个物体的动量都不会改变',
              '冲量是标量，动量是矢量'
            ],
            correctAnswer: 1,
            explanation: '根据动量定理 $I = \\Delta p$，冲量等于动量变化量，所以二者方向必须一致。冲量也是矢量。'
          },
          {
            question: '【守恒】质量为 $m$ 的特种兵在光滑冰面上开火，水平射出一块质量为 $m_0$ 速度为 $v_0$ (相对于地面) 的子弹。若开火前静止，则士兵开火后的后退速度为？',
            options: [
              '$\\frac{m_0 v_0}{m-m_0}$',
              '$\\frac{m_0 v_0}{m}$',
              '$\\frac{m v_0}{m_0}$',
              '$\\frac{m_0 v_0}{m+m_0}$'
            ],
            correctAnswer: 1,
            explanation: '系统动量守恒：$0 = m_0 v_0 + m v_{人}$ (规定子弹方向为正)，解得 $v_{人} = -\\frac{m_0 v_0}{m}$，大小对应 B。'
          },
          {
            question: '【碰撞】两辆质量同为 $M$ 的碰碰车 A 和 B 迎面相撞（A速度为 $v$， B速度为 $-2v$），碰后它们卡在一起共同运动，其碰后共同速度为？',
            options: ['$-\\frac{v}{2}$', '$\\frac{v}{2}$', '$-1.5v$', '$0$'],
            correctAnswer: 0,
            explanation: '完全非弹性碰撞公式，$Mv + M(-2v) = 2M v\'$， 化简得 $-Mv = 2M v\'$，即 $v\' = -\\frac{v}{2}$。'
          },
          {
            question: '【图像】物体的受力情况对应 $F-t$ 图像，在这张图中，“图线与坐标轴包围的面积”在物理学上代表什么？',
            options: ['物体增加的动能', '物体运动的路程', '力对物体做的功', '力对物体的冲量'],
            correctAnswer: 3,
            explanation: '冲量 $I = \\int F dt$。在 $F-t$ 图像中，也就是面积的积分意义。'
          }
        ]
      }
    ]
  }
];
