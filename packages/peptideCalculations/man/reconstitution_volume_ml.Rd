\name{reconstitution_volume_ml}
\alias{reconstitution_volume_ml}
\title{Calculate reconstitution volume}
\description{Calculates the diluent volume required to reach a target concentration from a peptide mass.}
\usage{reconstitution_volume_ml(mass_mg, target_mg_ml)}
\arguments{
  \item{mass_mg}{Lyophilized peptide mass in milligrams.}
  \item{target_mg_ml}{Desired final concentration in milligrams per millilitre.}
}
\value{Required diluent volume in millilitres.}
\examples{
reconstitution_volume_ml(10, 2)
}
