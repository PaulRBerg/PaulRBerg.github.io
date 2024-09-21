---
date: "2018-12-31 17:22:34 0000"
image: ["/assets/img/radical-markets/preview.jpg"]
layout: "post"
title: "Critique on Radical Markets"
---

![Radical Markets Cover](/assets/img/radical-markets/radical-markets.jpg)

## Context

Even if I'm far from being qualified to review academic writings on economics, I find the world of distributed ledgers
and cryptoeconomic theory a decent stepping stone for social sciences. I've been bashing my head against the wall with
blockchains for the good part of my recent history, so I have faith that this article will be read and appreciated by
someone, somewhere, sometime.

I'll further assume that you're familiar with the social reforms presented in
[Radical Markets](http://radicalmarkets.com). If you're not, go check out my loose
[introduction](https://prberg.com/2018/12/radical-markets/) to the book.

This article critically analyses the feasibility of implementing RM at scale. I grouped the analysis by chapters, but I
entertained a few holistic observations at the beginning. Whatever the future holds, the key to getting to a better
version of it is to stay open-minded yet also critical and lucid.

Importantly, I take it that Eric Posner and Glen Weyl are very much aware of the positive impact their ideas can have on
the world, hence why I aim to mostly present my constructive criticism.

## Prerequisites

My rationale is built upon a few core beliefs:

- Markets don't operate at their full capacity
- Homo Economicus doesn't and cannot exist
- Macroeconomics is more politics than economics
- Predictions are stupendously fragile endeavours

We shall see how all of them intersect with the concerns I had for each policy.

## COST

### The Hyperloop Dilemma

![Hyperloop](/assets/img/radical-markets/hyperloop.jpg)

The vignette at the beginning of the chapter describes a hypothetical scenario whereby Alejandro, the manager of
Hyperloop, has to buy all the properties required for building a railroad between Los Angeles (LA) and San Francisco
(SF). Under the current model, the markets aren't liquid enough and landowners may delay the acquisition to wait for a
higher price, hindering innovation which could positively impact everybody. So far so good.

Let's suppose that COSTs are implemented and Alejandro can instantly purchase all the land occupied on the most
practical path between LA and SF. Hyperloop gets battle-tested on the freshly built railroad and all the citizens of
California are thrilled that traveling has become so cheap and comfortable. Elon Musk throws a huge party and promotes
Alejandro to being the mayor of the Martian human base.

This land now provides a ton of value to society, that is, 30 min trips from LA to SF, but does Hyperloop have a
monopoly on the land on which the railroad was built? Shouldn't the company be subject to the same law as anyone else
and sell the land when they are outbid?

1. If yes, there are a few problems.
1. Hyperloop would need to value the properties abnormally high so that no one would be willing to pay the price.
   However, how large can their budget be? The COSTs would also be huge.
1. Notwithstanding the valuation of the land, we shouldn't expect a languished economy. Someone, sometime, will purchase
   one or more parcels because of financial incentives or oblivious irrationality.
1. If no, there are also a few problems.
1. Although trains are arguably special cases, dodging the COST would be highly analogous to eminent domain, but worse,
   allowing any economic actor to lock-in land.
1. It creates a precedent for a potential "social backdoor". Other companies, e.g. particle colliders, might express
   their interest in becoming exempted too by bringing evidence in support of their alleged social good.
1. It sounds a bit far-fetched to claim that we know as an absolute truth that Hyperloop makes the best use of the land
   it owns. What if someone comes up with an even better model and they need to build a perpendicular railroad
   (excluding bridges for now)?

A potential reconciliation is described in the book: aggregating parcels as estates (this might ring a bell with the
Decentraland folks out there).

> Possessors would be allowed to group their assets into clusters and to pull them apart, as they choose. That way, they
> would not be at risk of having their right shoe taken and being left with a useless left shoe.

The dilemma is now whether we should allow clusters as large as Hyperloop to exist. For one, I admit that trains could
merely be an isolated case, as companies don't usually run experiments 380 miles long. I only brought up the example
because it's presented at the beginning of the first chapter, but I posit that the concerns above are real and they
should be considered in advance.

### Shallow Prescription for Irrationality

![Irrationality](/assets/img/radical-markets/irrationality.jpg)

On numerous occasions, Glen Weyl [talks](https://youtu.be/uj186urDU8c?t=323) about how Marketopia (a world in which RM
is ubiquitously implemented) is immune to the discretionary control of the rich, because there's no such thing as
excessively rich people. This may be hands down true, as most of the wealth of present day Earth is held in stocks,
which are handled completely different in a RM powerhouse. However, the devil is in the details.

Let us acknowledge two important facts:

1. Marketopia doesn't reject the idea of money as an inter-subjective apparatus for transferring value. People have
   different work ethics, skills and so forth, hence their earnings can differ significantly even if we consider lower
   inequality.
2. While we definitely can design large-scale mechanisms applying game theory principles - cryptoeconomics is arguably a
   successful instantiation of that - we should never presume complete rational behavior.

Therefore, how does RM fend against a simple example of irrationality like griefing? Griefing is an act which doesn't
benefit the attacker, economically, politically or anyhow, but causes harm to somebody else. Within the Ethereum layer 2
research forums, this is a widely recognized issue and it is assumed that a researcher always has to consider it when
she proposes a new model.

Let's imagine Eve, an evil participant of Marketopia, and Iris, who's a regular, innocent citizen. Presuming Eve's
income is a few orders of magnitude higher than Iris', she's able to grief Iris by constantly buying out her properties
and forcing her to change her residency once every 3 months. Indeed, this is quirky behaviour and no rational person
would waste a ton of money just to cause harm to someone else, but there's no fundamental axiom that asserts this
scenario cannot happen lest we do something about it.

Should the government of Marketopia deem provable griefing as an exemption to the law and ban Eve from buying Iris'
properties? Wouldn't this create a precedent for other loopholes? I don't know.

### Other Concerns

1. While I agree that every modern society requires its citizens to have some basic literacy in law and economics, I
   find the COST a bit demanding for laymen. Valuation is a tough skill in and of itself - this is why there are
   [dozens](https://www.wallstreetoasis.com/forums/top-valuation-firms) of companies doing it as a paid service. With
   the advent of the on-demand, digital economy, I find it hard to believe we can educate the masses on the price
   elasticity of demand or other elusive economic concepts. Posner and Weyl postulate that there will be mobile apps
   helping users value their properties, but I'll later explain why I don't think this is truly feasible.
2. Should we actually enforce a market for everything? How could items like pens, trousers or laptops be tracked and how
   could we expect their owners to spend a significant amount of time to measure their value? There are a non-trivial
   opportunity and a cognitive cost at play.

- For many items, the Coasian cost of transaction could be way higher than the items themselves.
- Nick Szabo emphasises this problem in his
  [Micropayments and Mental Transaction Cost](https://nakamotoinstitute.org/static/docs/micropayments-and-mental-transaction-costs.pdf)
  paper.

3. This might be a weak and far-fetched idea, but I really wanted it to put it here to pick up the reader's brain. How
   can we reconcile COSTs with Metcalfe's Law? There are certain scenarios when value accrues where there are more
   people involved. As Twitter gets more and more popular, the experience gets more fun for everyone and I get more and
   more followers. Should I put a price tag on my following and pay a tax for it? If yes, this is weird because the
   person paying the price would become the owner of my account, but my followers wouldn't like that. If no, aren't
   accounts with huge swaths of followers monopolies? Whenever they tweet, they have the ability to economically
   influence the behavior of so many people.

## Quadratic Voting

![Voting](/assets/img/radical-markets/voting.jpg)

As stated before, mobile apps and technology in general are supposed to be an ancillary component to Marketopia. At the
high level, I totally love this! After watching the 2018 testimonial shows starring Mark Zuckerberg, Sundar Pinchai and
the US government, I'm thrilled to read about new political and economic models which involve the direct use of
technology. There's a catch though.

There's a specific threshold beyond which technology becomes a burden rather than a tool, a threshold which is measured
in incentives. Elections are in particular problematic because they settle who gets a ton of political power and who
doesn't. **In this case, incentives aren't just large, they are astronomically huge.**

Ryan North wrote a straightforward
[presentation](https://medium.com/s/story/i-am-a-computer-scientist-and-i-am-here-to-tell-you-to-never-trust-a-computer-with-anything-5a506c470d64)
on the problems of digital voting and I urge you to bookmark it for later if you're interested in the topic, but here's
the TLDR:

> Writing in binary is hard — so hard, in fact, that basically nobody wants to do it. Even if you succeed in doing it,
> what you’re producing is just a bunch of numbers, and it’ll be very hard for anyone—including you in a few weeks, once
> you forget what you wrote—to figure out what your code actually does.
>
> It’s not the end of the world if someone hacks in and sees my pizza being delivered. Nobody cares enough to try to
> break it. But voting is not one of those cases.

Essentially, very very few people know how to inspect binary code and assert if it's malicious or not. Then, it is
implausible to run nation-wide digital elections and expect that no software infrastructure/ product in the funnel -
DNS, BGP, the back-end servers, the front-end app, the local network - won't get hacked. Even if we assume an
infrastructure shielded with unbreakable diamond doors, there are still social attack vectors like
[phishing](https://searchsecurity.techtarget.com/definition/phishing). And, if you were wondering, no, neither Ethereum
nor any blockchain can magically fix this.

Taking a step back, I admit that RM doesn't imply that Quadratic Voting must be implemented digitally, but the voting
credits have to be stored somewhere and it is also argued that apps could be immensely helpful in aiding the user to
allocate her credits more wisely. Without accompanying technology, the cognitive cost may go through the roof, hence we
returned to a concern we previously discussed.

I acknowledge the fact that some of these arguments swirl around the core belief that people are "lazy", but, frankly, I
posit we really are! Modern markets made us that way. I don't have to know how Apple designs and engineers my MacBook. I
can just go to an authorized seller, swipe a magical plastic card and leave with a spectacularly powerful computing
device in my backpack.

### Other Concerns

1. Somehow related to the main thesis against digital voting is the issue of
   [Sybil attacks](https://www.youtube.com/watch?v=N8LnaHbY66w). In an election lacking solid identity control
   mechanisms, malicious actors can circumvent Quadratic Voting (that is, paying for more votes with quadratically more
   money) by voting with multiple identities. Maybe blockchain solutions like [uPort](https://www.uport.me),
   [Bloom](https://bloom.co) or [SelfKey](https://selfkey.org) will solve this problem, but we cannot ascertain it.

## Uniting the World's Workers

![Agreeement](/assets/img/radical-markets/agreement-bw.jpg)

The immigration policy proposed in the third chapter of the book is well-intentioned as it aims to bridge the gap
between excessively wealthy countries and the rest of the world by aligning the incentives of all participants:
immigrants, citizens and governments. Nonetheless, I tend to agree with
[Vitalik](https://vitalik.ca/general/2018/04/20/radical_markets.html#markets-in-everything) that the policy seems
unnecessarily complex and it sort of resembles a Ruby Goldberg machine.

Just as Posner and Weyl specified in the book, there's no guarantee that xenophobia won't mess up the plans, even if we
incentivise the hosts to look after the immigrants. As the discourse departs from the realm of economics into the one of
sociology and psychology, we might be better off if we start making already existing visas such as H-1B or J1 more
inclusive.

Having said that, I disagree with the argument that RM proposes a blunt modern slavery policy. It is estimated that
there are already
[~11 million illegal immigrants](https://en.wikipedia.org/wiki/Illegal_immigration_to_the_United_States) fuelling the
underground economy of the US. Contrasted to the unknown and probably lamentable work conditions of today, Marketopia
actually aims to make the lives of these tens of millions of people safer and better.

## Dismembering the Octopus

![Octopus](/assets/img/radical-markets/octopus-cut.jpg)

This has been one of the most interesting chapters from a factual point of view. Even if I did know about BlackRock,
Vanguard et al, I wasn't aware of the financial control they exert over the market. Given my current understanding of
economics, I find the proposal really solid, as it strives to generate more efficient economic outputs with little
large-scale changes.

Of course, the elephant in the room is the fact that there's hardly any incentive for the index funds to willingly make
the switch. Overlooking the monopoly argument, these companies worked hard over the years to reach a Pareto optimal-ish
investment position for themselves and their customers. For us to achieve our goals, the octopuses would have to:

1. Consciously give up on a significant portion of their stocks and earnings, at least in the short term.
2. Invest in human labour (hiring, training) to expand their expertise across industries. If an index fund is highly
   specialised in banks and suddenly they are restricted to not own more than 1% in two or more banks, they would need
   to get creative and move fast to diversify across industries.

This seems impractical lest the governments step in and enforce the new rules. As nowadays governments arguable
concentrate on other more urgent matters, it might take a while before the octopus can be dismembered.

### Other Concerns

1. Should venture capitalists (VCs) be subject to the same regulations? Even if they invest in stupendously risky
   businesses, they still have the freedom to diversify. If they cherry-pick 10 promising start-ups working on exactly
   the same idea, they have a much safer investment position compared to any entrepreneur involved in those startups.
   Admittedly, VCs are at the opposite poles of index funds when it comes to risk appetite and they rarely seek to avoid
   competition and innovation. In fact, they encourage it. The point though is that it turns out an entrepreneur makes
   the riskiest bet: she has to focus solely on her business and she's not allowed to hedge by pouring capital in other
   startups if she's not an accredited investor.
2. Although it's hard to hack Metcalfe's Law, how could we prevent giant tech corporations from accumulating more power?
   As mentioned in my introductory [article](https://prberg.com/2018/12/radical-markets#data-as-labor) to RM, GAFA
   managed to acquire fast growing contenders (e.g. Facebook buying rival app Instagram for \$1 billion). Similar
   mergers and acquisitions are unequivocally prohibited in traditional industries, so how should this situation be
   handled? Given the fact that Instagram actually became more fun thanks to the integration with Facebook, should tech
   companies be exempted? Hard to tell. What we do know is that we need more educated policymakers and more emphasis on
   technological literacy in secondary and tertiary education.

## Data as Labor

![Data](/assets/img/radical-markets/dollar.jpg)

Given enough time, I concur with Posner and Weyl that people will become more aware of the value of their data. We just
need a few more Cambridge Analytica incidents and we'll get there. The main difficulty is then centred around the
coordination issues between "siren servers", legislators and end users. Some questions:

1. Would users be contractors or employees? If the latter, how to get rid of minimum salaries?
2. Would data-as-labour actually eliminate the need for advertising? What about high gross margin products? I doubt that
   Lamborghini would prefer chasing people willing to earn $10 by telling what their friends ate this morning compared
   to paying $1,000 for ad impressions on the news feeds of rich users.
3. Even if people become aware of the value of their data, isn't it a bit intrusive to ask them to share intimate
   information about their friends? In Marketopia, I'd definitely be constantly wary of talking about anything personal
   with anyone else.

Nonetheless, there are signals in the blockchain space that adding an incentivisation layer to data-generating platforms
is something people want. For instance, there's this newly launched platform called [Cent](https://beta.cent.co) which
lets you "earn income from anywhere". Basically, it's Twitter with an Ethereum-powered tip mechanism, which is pretty
cool and it's getting good traction. Two other examples are [Akasha](https://akasha.world) and
[Steemit](https://steemit.com).

## Wrap-Up

I agree with the fact that the market is inefficient and that we should strive to reach an optimum state. All reforms in
RM are aimed at increasing economic output while decreasing inequality within and across countries, thus predicting an
enhancement of the performance of the market.

The scopes are indeed noble, but we have yet to see if (1) markets in everything makes sense at all, (2) the masses can
easily adapt to new economic responsibilities and (3) the book's macroeconomic predictions will stand the test of time.

In the meantime, let us remember Jeremy Bentham's fundamental axiom about governing societies:

> It is the greatest happiness of the greatest number that is the measure of right and wrong.

Finally, I thank you for reading this assessment and I hope that you enjoyed my discourse and found little to no noise
in it. If Eric or Glen will ever read this, I want to thank you for introducing me to economics through a beautiful,
ambitious and insightful book.

Find me on [Twitter](https://twitter.com/PaulRBerg) if you want to chat.

## Credits

- [Eric Posner](https://www.law.uchicago.edu/faculty/posner-e) & [Glen Weyl](http://glenweyl.com), the authors of
  [Radical Markets](http://radicalmarkets.com)
