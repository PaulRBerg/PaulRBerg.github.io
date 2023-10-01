---
date: "2018-12-27 02:14:42 0000"
image: "/assets/images/static-website-aws/preview.jpg"
layout: "post"
title: "How to Host a Static Website with S3, CloudFront and Route53"
---

## Context

I recently set-up my self-hosted personal blog and I underestimated the effort I had to put in to make it exactly as I
wanted to:

1. Pay-as-you-go hosting
2. SSL certificate
3. Functional www subdomain
4. Highly customizable but minimalistic design
5. Markdown-powered articles

I decided to write a tutorial to help others do it with less overhead. This article will go into fine details on how to
tick all the boxes above, with a focus on the back-end components. For 4 and 5, I used [Hugo](https://gohugo.io) with
the [Minimal](https://themes.gohugo.io/minimal/) theme.

### Caveat

Do note that this is a verbose tutorial, aimed at those who value flexibility and interoperability with other AWS
services more than anything else. If you're just looking for something light and quick, you may want to use
[Netlify](https://netlify.com) or [Amplify](https://aws-amplify.github.io).

## Prerequisites

I will further assume that:

1. You designed and coded your website or at least have a mock-up.
2. You have an AWS account (if not, go register one, first year has a free tier).
3. You are familiar with DNS and [how it works](https://www.cloudflare.com/learning/dns/what-is-dns/), at least at a
   high level.

Regarding DNS, a quick explanation is that it's sort of the directory of the Internet and, just like Google owns
"google.com", you can own "example.com" as well. To do it, you have to go a DNS registrar and purchase your the domain
you want. I strongly recommend using [Namecheap](https://namecheap.pxf.io/c/1243704/386170/5618) as your registrar, as
they have an awesome UI and low prices. As an alternative, you could choose [GoDaddy](https://godaddy.com).

In case your ".com" domain is taken and you want some clever mashups:

- [LeanDomainSearch](https://leandomainsearch.com)
- [Wordoid](https://wordoid.com)
- [Domainr](https://domainr.com)

After you purchase it, don't set any DNS records yet. We'll do that later once we get to Route53.

## Hosting with Amazon

As mentioned above, the goal is to use a pay-as-you-go service because it's by far the most cost-effective option out
there. I used to pay a fixed cost in the range of tens of USD per month for a server even if I had periods when there
was hardly any activity on it. Go modular, go with AWS!

Before jumping in, it's important to grasp the nomenclature:

- AWS: Amazon Web Services
- S3: Simple Storage Service, for storing files
- Route53: a service for handling DNS records
- CloudFront: content delivery network (CDN) for speeding up your website, also required to generate the SSL certificate

Here's a neat [mindmap](https://cloudcraft.co/view/d2391653-9c67-4bcd-84f2-977b0e32ecfc?key=aoBnq-ksfVXmgA4yjWIWSQ)
designed with [Cloudcraft](https://cloudcraft.co) for what you're going to build:

![Mindmap](/assets/images/static-website-aws/mindmap.jpg)

We'll first focus on the path on the **right-hand side**, so the normal configuration, not the one for the www
subdomain. Importantly, using this modular configuration, you won't run any back-end Linux server at all, so you don't
have mind updating or patching anything. How convenient is that?

## S3

![S3 Logo](/assets/images/static-website-aws/s3.jpg)

This is where you'll store your static files (HTML, CSS, JS). If you used Create React App or some other frontend
development framework, look after your generated "build" or "public" folder.

Here's what you have to do:

1. Set up an S3 bucket named "example.com". Notice that S3 bucket names are
   [global](https://stackoverflow.com/questions/24112647/why-are-s3-and-google-storage-bucket-names-a-global-namespace)
   and, just like with domains, you have to find an alternative if someone reserved "example.com" before you. Based on
   your needs, you can enable or disable the options AWS provides you: versioning, server access logging, encryption
   etc.
2. Make sure to uncheck the boxes that mention blocking and removing public access ACLs and policies. Many times, S3
   buckets are used to store private data, so AWS optimizes for highly secure configurations. In your case though, you
   want to have the bucket publicly accessible.
3. Make sure to set a policy, here's an [example](https://gist.github.com/PaulRBerg/61e0c998f105fedb627fa66ff2c6aea6).
4. Activate "Static website hosting" for your bucket and check "Use this bucket to host a website"
5. Upload your files, making sure "index.html" is at the root of your bucket

All the operations above can be done using either the AWS [administrator interface](http://console.aws.amazon.com) or
the [CLI](https://github.com/aws/aws-cli). Specifically for step 4 though, I'd recommend doing it in the console so that
you can get the endpoint for your new hosted website (I hid mine for privacy reasons):

![Static Website Hosting on S3](/assets/images/static-website-aws/static-website-hosting-s3.jpg)

Test it out in the browser to make sure you set up your S3 bucket correctly. It should like this:

> example.com.s3-website.your-region.amazonaws.com

## CloudFront

![CloudFront Logo](/assets/images/static-website-aws/cloudfront.jpg)

To host a static website, you don't actually need CloudFront or any other CDN, because there's not much data to store
and the gains in efficiency and UX are little. However, one of the original goals was to have a website secured by an
SSL certificate.

Now, you might've heard about CloudFlare, which is arguably the easiest way to get up and running with a CDN and also
benefit of some SSL security. I say "some" because they have this misleading feature called "Flexible SSL", which
[doesn't have the security guarantees](http://disq.us/p/1ycwtny) a self-signed SSL certificate has.

Therefore, you're not going to use that, but instead make use of a similar service in AWS called CloudFront. You can
think of it as having your own content distribution servers, as data is cached in multiple locations on Earth to provide
your users fast response times. More important for the static website, it also makes possible using an SSL certificate.

Again, you can create your CloudFront distribution using the AWS administrator interface or the CLI tool. Here's an
example [configuration](https://gist.github.com/PaulRBerg/7d946e54c8f5cfc22f514855c6b6e864).

Caveats:

1. The origin name should be the endpoint you got after activating "Static website hosting" on your S3 bucket.
2. Do NOT set any "DefaultRootObject". Leave it empty.
3. Allow both HTTP and HTTPS. You'll be able to automatically redirect users from HTTP to HTTPS after the certificate is
   signed and installed.

Make sure to wait a while for the distribution to properly boot (can take up to 15 minutes). Test it by opening the
endpoint you receive, your S3 static website should pop. The endpoint should look like this:

> 13fb4knzujxq0b.cloudfront.net

Note it somewhere because we'll use it with Route53 in a sec.

## Route53

![Route53 Logo](/assets/images/static-website-aws/route53.jpg)

It's time to connect the domain you bought on your DNS registrar with CloudFront and S3. Route53 acts as the bridge for
that.

1. Create a Route53 hosted zone and set your domain. Make it public.
2. You'll be given 4 NS records. Copy and paste the nameservers in your external domain administration page. If you're
   using [Namecheap](https://namecheap.pxf.io/c/1243704/386170/5618), here's how you can update your nameservers. Go to
   Account -> Dashboard -> Manage -> Nameservers -> Custom DNS and put your 4 nameservers in there:
   ![Namecheap Nameservers](/assets/images/static-website-aws/namecheap-nameservers.jpg)
3. Create a record set and leave the name empty (it will default to example.com). Then:

- Set the type to "A - IPv4 address"
- Respond with "Yes" to "Alias" and set the alias target to your CloudFront distribution url.
- Keep the routing policy as "Simple" and, based on your budget and needs, enable or disable "Evaluate Target Health".

4. Repeat step 3 for type "AAAA - IPv6 address" if you enabled your CloudFront distribution to be IPv6 compatible; if
   you followed this tutorial, IPv6 was enabled by default.

Note that DNS propagation can take up to [72 hours](https://www.youtube.com/watch?v=Gr8RzCZWh5M), although it should be
normally updated within a few hours or faster. If you previously set any other DNS records (like MX for work emails),
you'll have to reset them in Route53.

## WWWhat now?

Congrats for getting this far! I'm sorry to let you know that now you have to repeat all the previous three steps. Yes,
you heard that right, because of the elusive way the Internet works, "www" is not something included as a holistic
component of HTTP.

It is important to point out that it's really not mandatory to add a www subdomain to your website and you can safely
proceed to the next step _if_ you're fine with your end users not being able to access your website via
"www.example.com". I was a bit pedantic about it and I simply had to add the www subdomain.

Notes:

1. Redo only [S3](#s3), [CloudFront](#cloudfront) and [Route53](#route53), you don't have to (and can't) go to
   [Namecheap](https://namecheap.pxf.io/c/1243704/386170/5618) to buy "www.example.com".
2. For all the fields where you were asked to put "example.com", now put "www.example.com".

If you wonder whether by creating S3 buckets means you are required to deploy your static files to both of them, the
answer is no, you don't have to do that. When you activate "Static website hosting" for your second S3 bucket, select
"Redirect requests" instead of "Use this bucket to host a website":

![Static Website Hosting on S3 WWWW](/assets/images/static-website-aws/static-website-hosting-s3-www.jpg)

## SSL certificate

Let's Encrypt (LE) is one of the best things that happened to the Internet in the last couple of years. They have
democratized access to SSL certificates and this is a huge accomplishment, kudos to them! If LE was so helpful to you,
consider making a [donation](https://letsencrypt.org/donate/).

This step is crucial and also the hardest in the whole tutorial, so proceed carefully. You could use either your own
machine or a Linux server to generate the certificate, but I chose the former option, it's simpler and less expensive.

1. Head to the [certbot-s3front](https://github.com/dlapiduz/certbot-s3front) repo and install the tool. You need to
   have Python and pip installed.
2. Follow their instructions, but:

- Skip the S3 and CloudFront parts, you had already done that.
- Set "example.com,www.example.com" as the value for the "-d" (domain) parameter. Read more about this on the LE
  [forum](https://community.letsencrypt.org/t/certification-is-not-working-in-firefox-your-connection-is-not-secure/43090/6?u=paulrberg).

3. After you successfully generate your SSL certificate, you could optionally enable "Redirect HTTP to HTTPS" on your
   naked domain (that is, "example.com") CloudFront distribution. Don't do this for "www", as it'll redirect to your
   naked domain anyway.
4. Make sure to backup your `/etc/letsencrypt/live/example.com` certificate(s).

Notes:

1. Due to [mysterious reasons](https://github.com/dlapiduz/certbot-s3front/issues/70), I couldn't make certbot's
   authentication work by setting the "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" environment variables. This might
   be caused by the fact that I have several different profiles in my `~/.aws/credentials`, but I'm not sure. To avoid a
   "NoCredentialsError", just temporarily set a "default" profile and certbot will pick that up.
2. If you're unlucky like me and you get a further "IAMCertificateId" error, check out
   [this solution](https://github.com/dlapiduz/certbot-s3front/issues/76).

### ACM

Optionally, you could use the AWS Certificate Manager (ACM). Shortly after this article was published, a lot of people
jumped in to say that it'd be much easier to use ACM for generating certificates. No need to think about renewals, but
it means you're locked in with AWS.

## Bottlenecks

1. No server logic: This tutorial is only applicable to static websites, so you cannot run any back-end logic using a
   node.js module like [express](https://expressjs.com/). For that, you can either spin up an EC2 instance, write Lambda
   functions or use Docker via ECS/ Kubernetes.

2. LE certificates expire in 90 days: You can solve this in two ways. Firstly, you could set a reminder in your
   calendar, which I admit it's suboptimal, but I'm in an experimentation phase so I'm not bothered by a bit of manual
   work. Secondly, you could set a cron job, but you need a Linux server and use the "--renew-by-default --text" options
   when interacting with certbot.

3. Rich link previews can be a mess: This could be a problem specific to my Hugo theme, but I also think everyone wants
   to have a proper preview image and description when sharing their website links.
   [Here's](https://github.com/calintat/minimal/issues/61#issuecomment-449999181) how I managed to do it.

## Wrap-Up

Congrats, you now have a really cheap but still highly flexible static website! Billing stats for 100-1000 monthly
active visitors and fairly frequent S3 deployments are between $1 and $2, so this is a steal! For usage way beyond that,
you may need to upgrade your AWS components, but this is outside the scope of this tutorial.

If you're an experienced developer interested to replicate this tutorial on multiple AWS accounts, you may want to check
out [Terraform](https://terraform.io). It's a super duper cool Infrastructure-as-a-Service tool which you can use to
define your S3, CloudFront and Route53 as code snippets. Isn't technology so dang amazing?

Hope you find this tutorial helpful! Find me on [Twitter](https://twitter.com/PaulRBerg) if you want to chat.

## Credits

- [Amazon](https://amazon.com) for the AWS, S3, CloudFront and Route53 logos
