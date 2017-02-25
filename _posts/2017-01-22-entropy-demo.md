---
layout: post
title:  A mathematical representation of Entropy.
date:   2017-02-23 00:00:00
summary: A short post on what entropy is (in mathematics) and a demo to help you understand it.
categories:
 - math
 - physics
---

<script src="/entropy-demo/entropy-demo.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" integrity="sha384-wITovz90syo1dJWVh32uuETPVEtGigN07tkttEqPv+uR2SE/mbQcG7ATL28aI9H0" crossorigin="anonymous">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js" integrity="sha384-/y1Nn9+QQAipbNQWU65krzJralCnuOasHncUFXGkdwntGeSvQicrYkiUBwsgUqc1" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/contrib/auto-render.min.js" integrity="sha384-dq1/gEHSxPZQ7DdrM82ID4YVol9BYyU7GbWlIwnwyPzotpoc57wDw/guX8EaYGPx" crossorigin="anonymous"></script>
<link rel="stylesheet" href="/entropy-demo/style.css" type="text/css">

<p>
  I've read many articles online with differing, vague, descriptions of entropy. But I recently found out that it has a clear mathematical representation!
</p>

<p>
  Suppose you're performing an experiment which has 5 possible outcomes. We'll label them \(i = {1, ..., 5}\). And suppose that they each occur with probability \(p(i)\). \(p\) is called a distribution, which is just a fancy name for a function that gives you probabilities.
</p>

<p>
  You can associate a value with the distribution \(p\) called <i>entropy</i>. It tells you how many of the outcomes are "reasonably likely". If only one outcome is likely, the entropy is low. If many are likely, it's high.
</p>

<p>
  I'm going to show you the formula for entropy and then try to make sense of it.
</p>

<p>
  Here it is...

  $$
  E(p) = - \sum_{i=1}^{i=N} p(i) \log p(i)
  $$
</p>

<p>
  Let's pick this apart. There's a sum over all possible outcomes. For each term in the sum, you multiply the probability of the outcome with the log of the probability. And there's a negative sign out in front.
</p>

<p>
  In case you've forgotten what a log graph looks like, here it is...
</p>

<img src="/images/log.png" />

<p>
  Here's an important detail: probabilities are always between \(0\) and \(1\). And from the graph above, we can see that \(\log(x)\) is negative when \(x < 1\). So \(\log p(i)\) is always negative.
</p>

<p>
  This explains why there's a minus sign in our formula for entropy. Each term in the sum is negative, so the result of the sum negative. It feels good to have entropy be a positive number, so we stick a minus sign in front.
</p>

<p>
  Next, let's find the entropy for some simple distributions.
</p>

<p>
  Suppose you have an experiment with \(N\) outcomes. And let's say that one outcome has probability \(1\) and all other outcomes have probability \(0\). What's the entropy of this distribution?
</p>

<p>
  Consider the outcome with probability \(1\). It's term in the sum is \(1 \log 1 \), which is zero because \(\log 1\) is zero. And all the other terms are zero because \(p(i)\) is zero. So the entropy is \(0\).
</p>

<p>
  Okay, let's consider another distribution. Suppose all outcomes have equal probability. Then \(p(i) = \dfrac{1}{N}\) for each outcome. The sum becomes...
</p>

<p>
  $$
  \begin{aligned}
  E(p) & = - \sum_{i=1}^{i=N}\dfrac{1}{N} \log \dfrac{1}{N} \\
       & = - \log \dfrac{1}{N} \\
       & = \log N
  \end{aligned}
  $$
</p>

<p>
  In words: when all \(N\) outcomes have equal probability, the entropy is \(\log N\). This is the maximum possible entropy for a set of \(N\) outcomes.
</p>

<p>
  These examples matche what I said earlier! When entropy is high, many outcomes are likely. When the entropy is low, very few outcomes are likely. In the first example only one outcome is likely, so the entropy is low. In the second example, all outcomes are equally likely, so the entropy is high.
</p>

<p>
  The demo below lets you play with a probability distribution with \(5\) outcomes and see its entropy. You can drag the gray handles to move a bar up or down.
</p>

<p>
  Try making all the bars equal. You should see that the entropy is \(\log 5\) (or roughly \(2.32\)), as per the formula above.
</p>

<div class="demo-container">
  <div class="bars-container">
  </div>
  <div id="entropy-label" class="entropy-label sans-serif">
  </div>
</div>

<p>
  Something tricky to be aware of: the sum of probabilities of all outcomes should equal \(1\). When you move a bar around, the demo will shift the probabilities of other bars so that they all sum to \(1\).
</p>

<p>
  That's all for now! I'd like to talk about the applications of entropy, but I don't know enough about that yet. When I learn more, I'll write a part 2.
</p>

<script>
  renderMathInElement(document.body);
</script>
