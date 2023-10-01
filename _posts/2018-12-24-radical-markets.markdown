---
date: "2018-12-24 22:19:11 0000"
image: "/assets/images/radical-markets/preview.jpg"
layout: "post"
title: "Introduction to Radical Markets"
---

![Radical Markets Cover](/assets/images/radical-markets/radical-markets.jpg)

## Context

Although an engineer by heart, I couldn't help but get my feet wet with economics since blockchains became part of my
daily pastimes. Vitalik's been a massive influence in this direction, as most of his [writing](https://vitalik.ca)
involves subtle cryptoeconomic theory - imbued by that, the Ethereum community and countless shout outs to Radical
Markets (RM), I decided to give it a go. Now, I find the policies proposed in the book exceptionally intriguing, but I
do feel that the devil is in the details and there has to be a lot of experimentation before even trying to implement RM
at scale.

Having said that, the goal of this article is not to outlay my concerns on the said subject, but rather objectively
present it in minimalistic fashion. If you're like me, interested in economics but professionally floating around the
"conversational" level, you'll love this induction!

Posner and Weyl invite us to step in a universe where markets are sanctified entities and dictate the rules of the game.
Their proposition rhymes with Hayek's theory on the distribution of knowledge insofar the assumption is that the most
efficient market outcomes - the greatest good for the greatest number - are enacted when the economic arena is
decentralized.

You might wonder... isn't there another decentralized movement going on nowadays? Of course, blockchains! I'm still
[stunned](https://twitter.com/PaulRBerg/status/1067926815795232768) that RM was developed alongside Bitcoin, Ethereum &
friends. [Vitalik wrote an article](https://vitalik.ca/general/2018/04/20/radical_markets.html) in which he presented
the book and described a set of mechanism design projects that had already taken place in the Ethereum ecosystem.

Mind you, radicalism comes with a caveat: not everyone will find the book's proposals "digestible" as they challenge our
sensible beliefs regarding private ownership and marketplaces. Therefore, you may consider putting your seat belt before
continuing reading this article.

The book is split into five main chapters, each showcasing a radical approach. Let's dive right in!

## Common Ownership Self-Assessed Tax (COST)

![Property is Monopoly](/assets/images/radical-markets/property-is-monopoly.png)

The first chapter is all about reimagining private property. It is argued, on numerous occasions, that "property is
monopoly" and owners undermine the efficiency of the market as they can holdout on possessions. By that, we mean any
type of possession, but for simplicity we'll further restrict the analysis to real estate.

There are two principles at play:

1. Allocative efficiency: the ability of a market and its participants to distribute land to those who need it the most
   and can make the greatest use of it.
2. Investment efficiency: the ability of a market and its participants to encourage productive activity, particularly
   building capital goods, whose long-term benefits exceed its costs.

The discourse goes into fine details on how present-day capitalism optimizes for investment efficiency, while
significantly dwindling allocative efficiency. To counteract this issue, the authors propose a "COST": an (annual) tax
proportional to the self-assessed value of your land; this is also called a Harberger tax.

What's the catch? Well, you have to stand ready to sell your property to **anyone** willing to pay the price you set. At
**any time** henceforth.

![Whaaat?](/assets/images/radical-markets/whaaat.gif)

There are two counterbalancing forces:

1. ↓ The annual tax serves as an incentive to lower your valuation
2. ↑ As land essentially becomes a public good, you surely don't want to lose it very easily, so you'll increase the
   valuation to a comfortable level

_Note: the proposal doesn't imply that you'd have to move your things tomorrow if someone is willing to pay the price.
However, it does mean that you have to leave the property within a commonly-agreed standard period (e.g. 3 months)._

The authors claim that we'd achieve much more efficient economic output, had we optimized for allocative efficiency. The
vignette at the beginning of the chapter describes a hypothetical scenario whereby Alejandro, the manager of Hyperloop,
has to buy all the properties required for building a railroad between Los Angeles (LA) and San Francisco (SF). Under
the current model, the markets aren't liquid enough and landowners may delay the acquisition to wait for a higher price,
hindering innovation which could positively impact everybody.

You also might wonder how big this tax should be. Posner and Weyl proposed 7%, as this is the optimal figure signalled
by their models and the empirical evidence they've collected so far. Nevertheless, it's not set in stone and further
research is needed.

The COST is arguably the most complex and groundbreaking idea in the whole book, but this is what makes it exciting at
the same time. You may find it entertaining that you can buy the right to put what you want on the banner of the
"/r/ethtrader" subreddit by
[paying a COST with your Donuts.](https://www.reddit.com/r/ethtrader/comments/a3r1bn/you_can_now_change_the_top_banner_on_the_redesign/)

## Quadratic Voting

![Quadratic Voting](/assets/images/radical-markets/quadratic-voting.png)

Do you ever feel that 1 person 1 vote (1p1v) simply doesn't work? That minorities are seriously neglected and
underrepresented? Generally speaking, that present-day democracy fails egregiously hard? Well, you're not the only one,
because RM has a provocative argument for a mechanism design tackling the said problem.

Quadratic Voting (QV) refers to the spooky idea that votes should incur a cost, but a cost which isn't linear, rather
quadratic. In plain English, that means that 1 vote costs $1, 2 costs $4, 3 costs \$9 and so forth (the square of the
numbers of votes).

Why would this work?

Relative to an individual, the authors consider voting a tool that causes either:

1. Good
2. Harm
3. Nothing, the individual isn't affected

**There is economic value attached to voting outcomes**.

The above might seem an obvious notion, but it can be demystifying when articulated.

Let's imagine Judy: an average citizen of King's Landing who lives a happy life as a blacksmith. Now, let us ask people
to vote on whether taxes on steelmaking should be increased by 10% to disincentive private ownership of dangerous
weapons.

The graph below is a mathematical representation of the cost incurred by King's Landing's citizens with and without Judy
in town **if the aforementioned proposal passes.**

![Quadratic Voting Graph](/assets/images/radical-markets/quadratic-voting-judy.jpg)

The x-axis plots the quantity of votes, while the y-axis the price paid for those votes.

There are three vantage points:

1. Judy: A higher tax on steelmaking means a huge cost for her, because it directly affects her business.
2. Others (this is everybody else minus Judy): There might be other blacksmiths in town who strongly oppose the
   proposal, but there are clearly more citizens that are either against dangerous weapons or merely indifferent.
3. Society: The total cost incurred by King's Landing's citizens, including Judy.

We can draw a conclusion: not everyone has the same interest in a specific output of an election, therefore 1p1v is
highly inefficient from an economic point of view.

The striped triangle in the figure above denotes the "deadweight loss" of society, or the value lost by Judy if the tax
proposal passes. As we can all surely recall, the formula for the area of a triangle is:

> area = height \* base / 2

Lo and behold quadratic voting! In an election whereby Judy has the option of buying votes proportionally to her
economic interest, she may have a chance to fend her business - provided there are other blacksmiths as motivated as she
is. QV optimizes for intensity rather than oblivious quantity.

If you want to see QV at play, check out the [Collective Decision Engines](https://collectivedecisionengines.com)
project.

## Uniting the World's Workers

![Uniting the World's Workers](/assets/images/radical-markets/uniting-workers.png)

Inequality has reached staggering figures over the last decades. In OECD countries, the income of the richest 10% of the
population is [9 times](http://www.oecd.org/social/inequality.htm) that of the poorest 10%. It is true that these data
are in regards to inequality within countries, but there are huge disparities across countries as well.

Between 1820 and 1970, inequality between countries has risen tenfold. Since 1970 to present day, it's been on a slowly
decreasing trajectory mostly due to globalization, but we still bear the effects of the Industrial Revolution:
asymmetrical GDPs grant a handful of countries control over the international markets.

For instance, let's compare the United States with Nepal.

1. United States: minimum annual wage is [\$15,080](https://en.wikipedia.org/wiki/Personal_income_in_the_United_States)
2. Nepal: minimum annual wage is [\$1,400](https://en.wikipedia.org/wiki/List_of_minimum_wages_by_country), while the
   average is [\$9,802](https://www.averagesalarysurvey.com/nepal)

One could draw that a randomly chosen American is 10x wealthier than a Nepalese citizen. Not even the average salaries
in Nepal get close to the minimum in the States: two thirds of that. Mind you, Nepal isn't among the
[poorest countries in Asia](https://en.wikipedia.org/wiki/List_of_Asian_countries_by_GDP), hence these figures could be
even worse if we consider the extreme cases.

The rationale underpinning RM is based on basic economic theory: rational actors are driven by incentives, which means
there's hardly anything we can do to prevent the swaths of immigrants from pursuing their financial interests. In the
US, estimates in 2015 put the number of unauthorized immigrants at
[11 million](https://en.wikipedia.org/wiki/Illegal_immigration_to_the_United_States), representing 3.4% of the total
population.

Similarly, it's implausible to expect inequality between countries to plummet overnight, especially given the recent
growth of Internet-based companies like [GAFA](https://en.wikipedia.org/wiki/Big_Four_tech_companies). We need bridges
to deal with the issue in the medium term, the argument goes.

![Agreeement](/assets/images/radical-markets/agreement.jpg)

_Note: this analysis refers mostly to the US, where immigration is an increasingly important dilemma, but it's
applicable to any other wealthy country which blocks access to international workers._

What if anyone would be allowed to bring an immigrant and be remunerated for that, provided they are responsible for
finding an immigrant more likely to succeed in the country and less likely to commit crimes?

Posner and Weyl claim that this would allow the incentives of immigrants, citizens and governments.

1. Immigrants: Obviously, immigrants would smile upon this proposal because they will see their income grow by a few
   orders of magnitude. They will probably send some of their hard-earned cash back home, making means end for their
   family and marginally increasing their country's GDP.

2. Citizens: Large companies with offices all around the world have the ability to sponsor an H-1B visa for their
   high-skilled employees. It is argued that this is unfair advantage corporations are given and individuals should be
   entitled to the same rights. We shouldn't limit the scope of the visa just for talented workers, but apply it to
   mundane jobs as well and reward the citizens who researched the best candidate immigrants.

3. Governments: As pointed before, incentives are unstoppable, hence governments can't remain quiescent on the emerging
   underground economy forever. Enacting an official immigration scheme, one that is more inclusive, could be an
   economic (and political) boon in the long term.

Furthermore, the authors argue that their suggested immigration scheme would significantly lower the populism backlash
currently undergoing in many wealthy countries (Brexit, anyone?), where nationalism may hinder economic growth. Looking
after an immigrant for an extended period might make the host more open to the immigrant's culture, food or even their
language.

Of course, the scheme could create a bond between the two parties, but it could also fail miserably due to xenophobia
and bigotry. After all, this is uncharted territory, but inaction can be as dangerous too.

Personally, you might have several if not many concerns about this immigration scheme. You might even find it bonkers!
Yet let us remember that we haven't asserted this is the best way forward, only that this is what the authors talk about
in RM.

## Dismembering the Octopus

![Dismembering the Octopus](/assets/images/radical-markets/octopus.png)

For a novice economist, this is a provocative chapter because it reveals a lot of interesting stats on the quiet
mechanics of the market; specifically, we'll discuss how index funds like BlackRock or Vanguard have surreptitiously
accumulated too much financial power over time.

Monopoly is nothing new under the sun: governments are aware of the economic stagnation caused by it, hence they've been
actively going after monopolists by enacting antitrust laws. This chapter describes how a group of seemingly innocent
and well-intentioned businesses -- index funds -- avoided these laws and grew so large that they now hinder economic
growth.

The goal of any investment fund is to diversify their customers' money into as many **safe** assets as possible. A
strong candidate for that is the stock of companies that constantly generate positive cash flows. You may notice where
this is going.

Over time, these funds have diversified so much insofar they now have a substantial stake in the majority of large
corporations. For instance, take a look at the following table with the top 5 owners of the largest six US banks:

![Bank Stake Distribution](/assets/images/radical-markets/bank-stake-distribution.jpg)

When stakes are so spread out, **there's an incentive to optimize for aggregate profits rather than waste effort on
competition**. As large stake grants investors a say in the governance of the corporation, index funds exploit the CEOs
to lower their drive to compete. This handicaps the market: poor products and services and low interest rates.

The proposed solution sounds like this:

1. Put a cap on the stakes investment funds can own in multiple companies within the same sector
2. Let them diversify with the provable condition that they aren't involved in the governance of any of their
   investments

Notice the subtlety of the first point: index funds are free to diversify **across** multiple sectors, but not
**within**. Therefore, this would hardly affect the returns they promise their customers.

Indeed, it would require fund managers to put more effort in cherry-picking safe bets and proactively aiding the CEOs
weave competitive strategies - but this is exactly the goal of this proposal, to avoid laziness and spur economic
activity.

## Data as Labor

![Data as Labor](/assets/images/radical-markets/data-as-labor.png)

If the previous chapter was all about monopoly, let's flip the table on its side and discuss monopsony: the state of the
market in which one or a handful of companies are the sole buyers of an asset.

Internet enterprises managed to dodge many regulatory constraints largely due to (1) their endemic tendency towards
aggregation (see Metcalfe's Law) and (2) the lack of sound classification methodologies.

- Facebook bought Instagram and WhatsApp and accumulated a huge portion of the social media market share.
- Google bought Waze and DeepMind and gained a competitive edge at self-driving cars and artificial intelligence.
- Microsoft acquired LinkedIn and GitHub and significantly enhanced their software arsenal.

![Data as New Oil](/assets/images/radical-markets/data-as-new-oil.jpg)

[There is no such thing as a free lunch](https://www.phrases.org.uk/meanings/tanstaafl.html). As "free" digital services
are concerned, we are the product. Tech companies collect gargantuan amounts of data every time we scroll, like or
message anyone on their platforms. This is the contract you're getting into when you casually accept those 50-page long
Terms and Conditions on sign up.

Perhaps this is the most digestible proposal out there: **what if you could be paid for the (economic) value of the data
you create for tech companies?**

Imagine Facebook asking you about "offline" data about your friends:

- "What happened to Alice over the weekend? She hasn't posted in four days."
- "Is Bob flirting with Carol?"
- "Has Danny dropped out of her ballet course?"

This would help the AIs make better matches and reduce the number of deadweight ads on the news feed, the theory goes.

You might consider this creepy and outside the realm of what you feel Facebook should know about you and your friends'
lives, but we're already signalling a ton of information. Adding an incentivization layer for sharing data would do
infinitesimally small harm, marginally speaking. It is claimed that the benefits of compensating users for their data
could considerably outweigh the disadvantages.

As a bonus, don't forget to take a look at the data platforms emerging in the blockchain space:

- [Enigma](https://blog.enigma.co/the-enigma-data-marketplace-is-live-84a269ec17fb)
- [Streamr](https://www.streamr.com)
- [Datum](https://datum.org)
- [OceanProtocol](https://oceanprotocol.com)

## Wrap-Up

I hope this writing served as a smooth introduction to Radical Markets and that you found Posner and Weyl's ideas
thought-provoking, at worst. I also wrote a [follow-up article](https://prberg.com/2018/12/critique-radical-markets) in
which I expressed my concerns regarding Radical Markets.

If you enjoyed what it was presented here, you may want to follow [@RadxChange](https://twitter.com/RadxChange) on
Twitter and consider joining the RadicalXChange [conference](https://radicalxchange.org) taking place between 22-24
March 2019 in Detroit, Michigan.

Find me on [Twitter](https://twitter.com/PaulRBerg) if you want to chat.

## Credits

- [Eric Posner](https://www.law.uchicago.edu/faculty/posner-e) & [Glen Weyl](http://glenweyl.com), the authors of
  [Radical Markets](http://radicalmarkets.com)
- [Alexander Gard-Murray](http://gard-murray.com/) for the chapter leading graphics
- [Azar, José and Raina, Sahil and Schmalz, Martin C.](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2710252) for
  the bank ownership table
- [David Parkins](https://www.davidparkins.com) in
  [the Economist](https://www.economist.com/leaders/2017/05/06/the-worlds-most-valuable-resource-is-no-longer-oil-but-data)
