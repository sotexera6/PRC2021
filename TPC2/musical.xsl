<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    exclude-result-prefixes="xd"
    version="1.0">
    <xd:doc scope="stylesheet">
        <xd:desc>
            <xd:p><xd:b>Created on:</xd:b> Mar 2, 2021</xd:p>
            <xd:p><xd:b>Author:</xd:b> sat</xd:p>
            <xd:p>Conversão do musical de XML para TTL</xd:p>
        </xd:desc>
    </xd:doc>

    <xsl:output method="text" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match = "/">
        <xsl:apply-templates select="/" mode="obras"/>
        <xsl:apply-templates select="//instrumentos" mode="instrumentos"/>
        <xsl:apply-templates select="//partitura" mode="instrumento"/>
    </xsl:template>

    <xsl:template match="obra" mode="obras">
        ###  http://www.di.uminho.pt/prc2021/mapa#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Obra ;
        <xsl:if test="instrumentos"><xsl:apply-templates mode="indice" select="instrumentos"/></xsl:if>
        <xsl:if test="titulo">
        :titulo "<xsl:value-of select="titulo"/>"</xsl:if>
        <xsl:if test="subtitulo"> ;
        :subtitulo "<xsl:value-of select="subtitulo"/>"</xsl:if>
        <xsl:if test="tipo"> ;
        :tipo "<xsl:value-of select="tipo"/>"</xsl:if> 
        <xsl:if test="compositor"> ;
        :compostoPor :<xsl:value-of select="translate(translate(compositor, ' ',''), ',','_')"/></xsl:if>
        <xsl:if test="arranjo"> ;
        :arranjo "<xsl:value-of select="arranjo"/>"</xsl:if>
        <xsl:if test="inf-relacionada/video"> ;
        :video "<xsl:value-of select="inf-relacionada/video/@href"/>"</xsl:if> .
        # ----------------------------------------

        
        <xsl:if test="compositor"> ;
        ###  http://www.di.uminho.pt/prc2021/mapa#<xsl:value-of select="translate(translate(compositor, ' ',''), ',','_')"/>
        :<xsl:value-of select="translate(translate(compositor, ' ',''), ',','_')"/> rdf:type owl:NamedIndividual ,
        :Compositor .
        # ----------------------------------
        </xsl:if>
    </xsl:template>

    <xsl:template match="instrumento" mode="indice">:temInstrumento :ins_<xsl:value-of select="generate-id()"/> ;</xsl:template>

    <xsl:template match="instrumento" mode="instrumentos">
        ###  http://www.di.uminho.pt/prc2021/mapa#ins_<xsl:value-of select="generate-id()"/>
        :ins_<xsl:value-of select="generate-id()"/> rdf:type owl:NamedIndividual ,
        :Instrumento ;
        <xsl:apply-templates mode="partituras" select="partitura"/>
        :designação "<xsl:value-of select="designacao"/>" .
        #-----------------------------------
    </xsl:template>

    <xsl:template match="partitura" mode="partituras">:temPartitura :par_<xsl:value-of select="generate-id()"/> ;</xsl:template>

    <xsl:template match="//partitura" mode="instrumento">
        ###  http://www.di.uminho.pt/prc2021/mapa#par_<xsl:value-of select="generate-id()"/>
        :par_<xsl:value-of select="generate-id()"/> rdf:type owl:NamedIndividual ,
        :Partitura ;
        :path "<xsl:value-of select="@path"/>" ;
        :type "<xsl:value-of select="@type"/>"
        <xsl:if test="@clave"> ;
        :clave "<xsl:value-of select="@clave"/>"</xsl:if>
        <xsl:if test="@voz"> ;
        :voz "<xsl:value-of select="@voz"/>"</xsl:if>
        <xsl:if test="@afinacao"> ;
        :afinação "<xsl:value-of select="@afinacao"/>"</xsl:if> .
        # ----------------------------------
    </xsl:template>

</xsl:stylesheet>

